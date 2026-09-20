"""Fixtures for the export tests.

The application is a set of static files with no build step, so the tests serve
`src/` over HTTP and drive the real page in headless Chromium. Nothing is
re-implemented here: every assertion goes through the same buttons a user
presses, and reads back the PNG the browser would have downloaded.
"""

from __future__ import annotations

import base64
import functools
import http.server
import json
import re
import socket
import threading
from pathlib import Path

import pytest
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# The root component keeps everything in setup(), and Vue hangs the instance off
# the mount container. That is the whole interface these tests need.
SETUP_STATE = "document.querySelector('#app').__vue_app__._container._vnode.component.setupState"

# Injected before the page runs.
#
# Two things have to be reachable from the outside: the finished PNG, which the
# app hands to the browser as a download and would otherwise leave the page, and
# the text the renderer actually draws, which only exists for the moment between
# the export-time shortening and the screenshot.
PAGE_HOOKS = """
window.__bkg = { downloads: [], renders: [] };

// Keep the blob instead of letting the browser save it.
const nativeClick = HTMLAnchorElement.prototype.click;
HTMLAnchorElement.prototype.click = function () {
  if (this.download && this.href && this.href.startsWith('blob:')) {
    window.__bkg.downloads.push({ name: this.download, url: this.href });
    return;
  }
  return nativeClick.apply(this, arguments);
};

window.__bkg.take = async () => {
  const entry = window.__bkg.downloads.pop();
  if (!entry) return null;
  const bytes = new Uint8Array(await (await fetch(entry.url)).arrayBuffer());
  let binary = '';
  const chunk = 8192;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return { name: entry.name, data: btoa(binary) };
};

window.__bkg.exportFrame = () => document.querySelector('iframe[aria-hidden="true"]');

// The export runs in a hidden iframe. Loading a different template replaces that
// document and with it the screenshot library, so the hook is re-applied rather
// than installed once.
setInterval(() => {
  const win = (window.__bkg.exportFrame() || {}).contentWindow;
  if (!win || !win.modernScreenshot || win.__bkgHooked) return;
  win.__bkgHooked = true;
  const domToBlob = win.modernScreenshot.domToBlob;
  win.modernScreenshot.domToBlob = function (node, options) {
    const frame = node.getBoundingClientRect();
    const slots = {};
    for (const el of node.querySelectorAll('[data-slot]')) {
      if (el.tagName === 'IMG') continue;
      const box = el.getBoundingClientRect();
      slots[el.dataset.slot] = {
        text: el.textContent,
        box: {
          x: box.left - frame.left,
          y: box.top - frame.top,
          width: box.width,
          height: box.height,
        },
      };
    }
    window.__bkg.renders.push({ format: node.dataset.format, slots });
    return domToBlob.call(this, node, options);
  };
}, 20);
"""

HOOK_READY = """() => {
  const win = (window.__bkg.exportFrame() || {}).contentWindow;
  return !!(win && win.__bkgHooked);
}"""


class _Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".woff2": "font/woff2",
        ".webp": "image/webp",
        ".js": "text/javascript",
        ".json": "application/json",
    }

    def log_message(self, *args):  # keep pytest output readable
        pass


@pytest.fixture(scope="session")
def base_url():
    """Serves src/ on a free port for the length of the session."""
    handler = functools.partial(_Handler, directory=str(SRC))
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        port = probe.getsockname()[1]
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{port}"
    finally:
        server.shutdown()
        server.server_close()


@pytest.fixture(scope="session")
def _page(base_url):
    """One browser page for the whole session; `app` resets the state per test."""
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        context = browser.new_context(viewport={"width": 1600, "height": 1000})
        context.add_init_script(PAGE_HOOKS)
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(base_url + "/index.html", wait_until="networkidle")
        page.wait_for_function(f"() => !!({SETUP_STATE})")
        page.wait_for_function(f"() => ({SETUP_STATE}).templates.length > 0")
        yield page, errors
        context.close()
        browser.close()


class BrandKit:
    """The application, driven through its own setup() state."""

    def __init__(self, page, errors):
        self.page = page
        self.errors = errors
        self.last_filename = None

    # -- state ------------------------------------------------------------
    def evaluate(self, body, arg=None):
        """Runs `(s, arg) => ...` with `s` bound to the root component's state."""
        return self.page.evaluate(
            f"(arg) => {{ const s = {SETUP_STATE}; return ({body})(s, arg); }}", arg
        )

    def reset(self):
        """Back to the factory state before every test.

        `resetAll` is what the reset button does and covers the brand, the
        colour and font sets and the content. The preview format, the format
        selection, the background and the language sit outside it, so they are
        put back here. The language is pinned to English so that a message can
        be compared against a known string.
        """
        self.evaluate(
            """(s) => {
                s.resetAll();
                s.currentFormat = s.SOCIAL_FORMATS[0];
                s.selectedFormats = s.SOCIAL_FORMATS.map(f => f.id);
                s.removeCustomBg();
                s.setLang('en');
            }"""
        )
        self.page.evaluate("() => { window.__bkg.downloads.length = 0; window.__bkg.renders.length = 0; }")
        self.page.wait_for_timeout(50)
        self.errors.clear()
        return self

    @property
    def templates(self):
        return self.evaluate(
            "(s) => s.templates.map(t => ({ id: t.id, name: t.name, slots: t.slots, error: t.error }))"
        )

    @property
    def formats(self):
        return self.evaluate("(s) => s.SOCIAL_FORMATS.map(f => ({ ...f }))")

    @property
    def fonts(self):
        return self.page.evaluate("() => window.BKG_FONTS.map(f => f.id)")

    @property
    def toast(self):
        return self.evaluate("(s) => ({ ...s.toast })")

    def translate(self, key, lang="en", **vars_):
        return self.page.evaluate(
            "([key, lang, vars]) => window.BKG_I18N.translate(lang, key, vars)",
            [key, lang, vars_],
        )

    def select(self, *, template=None, fmt=None, font=None, language=None, **content):
        """Sets what a post is made of, the way the panels do."""
        self.evaluate(
            """(s, a) => {
                if (a.template) s.selection.templateId = a.template;
                if (a.fmt) s.currentFormat = s.SOCIAL_FORMATS.find(f => f.id === a.fmt);
                if (a.language) s.setLang(a.language);
                if (a.font) {
                  const set = s.fontSets.find(x => x.id === s.selection.fontSetId) || s.fontSets[0];
                  set.variations[0].font = a.font;
                  set.variations[0].axes = {};
                }
                for (const [key, value] of Object.entries(a.content)) s.content[key] = value;
            }""",
            {"template": template, "fmt": fmt, "font": font, "language": language, "content": content},
        )
        # let Vue flush and the normalisers run before anything is rendered
        self.page.wait_for_timeout(80)
        return self

    def set_background(self, path, *, expect_warning=False):
        """Picks a background file, through the real input.

        Going through the input matters: whether a fresh picture drops the
        stored framing, slots into it or is asked about first is decided in
        that handler. `expect_warning` waits for the question instead of for
        the picture.
        """
        self.page.set_input_files('input[type="file"][accept="image/*"]', str(path))
        if expect_warning:
            self.page.wait_for_function(f"() => !!({SETUP_STATE}).pendingBgSwap")
        else:
            self.page.wait_for_function(f"() => !!({SETUP_STATE}).customBgUrl")
        self.page.wait_for_timeout(120)
        return self

    @property
    def background_warning(self):
        """The question asked before a picture replaces an awaited one."""
        return self.evaluate("(s) => s.pendingBgSwap && { ...s.pendingBgSwap, url: undefined }")

    def answer_background_warning(self, use_it):
        self.evaluate("(s, v) => v ? s.confirmBgSwap() : s.cancelBgSwap()", bool(use_it))
        self.page.wait_for_timeout(150)
        return self

    def remove_background(self):
        self.evaluate("(s) => s.removeCustomBg()")
        self.page.wait_for_timeout(80)
        return self

    def reload(self):
        """Starts the app over, the way closing and reopening the tab does.

        Only what was written out survives: the setup in localStorage and the
        picture in the asset store.
        """
        self.page.reload(wait_until="networkidle")
        self.page.wait_for_function(f"() => !!({SETUP_STATE})")
        self.page.wait_for_function(f"() => ({SETUP_STATE}).templates.length > 0")
        self.page.wait_for_timeout(200)
        return self

    def zoom_background(self, zoom):
        """Sets the zoom of the framing for the template and format on screen."""
        self.evaluate("(s, z) => { s.editFraming().zoom = z; }", zoom)
        self.page.wait_for_timeout(80)
        return self

    @property
    def framing(self):
        """The framing row the preview is using."""
        return self.evaluate("(s) => ({ ...s.framing })")

    @property
    def all_framing(self):
        """Every stored row: templateId -> formatId -> {x, y, zoom}."""
        return self.evaluate("(s) => JSON.parse(JSON.stringify(s.bgFraming))")

    # -- export -----------------------------------------------------------
    def _run_export(self, action):
        self.page.evaluate("() => { window.__bkg.downloads.length = 0; window.__bkg.renders.length = 0; }")
        self.evaluate(f"(s) => s.{action}()")
        self.page.wait_for_function(f"() => !({SETUP_STATE}).isExporting")
        result = self.page.evaluate("() => window.__bkg.take()")
        if result is None:
            raise AssertionError(f"{action} produced no file. Toast: {self.toast}")
        return result["name"], base64.b64decode(result["data"])

    def export_png(self, *, capture=False):
        """The PNG the bottom bar's PNG button would download."""
        name, data = self._run_export("exportSinglePNG")
        if capture and not self.renders:
            # The first export after a template change loads the screenshot
            # library into a fresh iframe document; the hook follows a moment
            # later, so that one export goes uncaptured.
            self.page.wait_for_function(HOOK_READY)
            name, data = self._run_export("exportSinglePNG")
        self.last_filename = name
        return data

    def export_zip(self):
        """The archive the ZIP button would download."""
        name, data = self._run_export("exportZipPackage")
        self.last_filename = name
        return data

    def export_config(self, with_image=None) -> str:
        """The setup file the "save setup" button writes.

        With a background set the app asks whether the picture goes into the
        file; `with_image` answers that. Without one there is nothing to ask.
        """
        self.page.evaluate("() => { window.__bkg.downloads.length = 0; }")
        self.evaluate("(s) => s.exportConfigJson()")
        if self.evaluate("(s) => !!s.pendingSave"):
            assert with_image is not None, "the app asked about the background"
            self.evaluate("(s, v) => s.confirmSave(v)", bool(with_image))
        else:
            assert with_image is None, "the app did not ask about a background"
        result = self.page.evaluate("() => window.__bkg.take()")
        assert result is not None, f"no setup file was written. Toast: {self.toast}"
        self.last_filename = result["name"]
        return base64.b64decode(result["data"]).decode("utf-8")

    def import_setup(self, path):
        """Loads a setup file the way the "load setup" button does.

        An import is shown for confirmation first, so the dialog is confirmed
        here as well.
        """
        self.page.set_input_files('input[type="file"][accept=".json"]', str(path))
        self.page.wait_for_function(f"() => !!({SETUP_STATE}).pendingImport")
        self.evaluate("(s) => s.confirmImport()")
        self.page.wait_for_timeout(80)
        return self

    def pan_background(self, dx, dy):
        """Drags the background by a fraction of the preview, with the mouse.

        The offset is only reachable through the drag handlers, so this goes
        through them rather than around them.
        """
        box = self.page.evaluate(
            """() => {
                const preview = [...document.querySelectorAll('iframe')]
                  .find(f => f.getAttribute('aria-hidden') !== 'true');
                const rect = preview.parentElement.getBoundingClientRect();
                return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
            }"""
        )
        start_x = box["x"] + box["width"] / 2
        start_y = box["y"] + box["height"] / 2
        self.page.mouse.move(start_x, start_y)
        self.page.mouse.down()
        self.page.mouse.move(
            start_x + dx * box["width"], start_y + dy * box["height"], steps=5
        )
        self.page.mouse.up()
        self.page.wait_for_timeout(80)
        return self

    # -- what the renderer drew -------------------------------------------
    @property
    def renders(self):
        """One entry per frame handed to the screenshot library, newest last."""
        return self.page.evaluate("() => window.__bkg.renders")

    def drawn_slots(self):
        """Every placeholder, with its text and box, as the last export drew it."""
        renders = self.renders
        assert renders, "no frame was captured - export with capture=True"
        return renders[-1]["slots"]

    def drawn(self, slot):
        """Text and box of one placeholder as the last export drew it."""
        slots = self.drawn_slots()
        assert slot in slots, f"the template has no {slot!r} placeholder: {sorted(slots)}"
        return slots[slot]

    def laid_out_text_width(self, slot):
        """Width of the text run itself in the export stage, not of its box.

        Read after an export, when the shortening has been undone, so this is
        how wide the full text is when nothing is cut off.
        """
        return self.page.evaluate(
            """(slot) => {
                const frame = window.__bkg.exportFrame();
                const el = frame.contentDocument.querySelector(`[data-slot="${slot}"]`);
                const range = frame.contentDocument.createRange();
                range.selectNodeContents(el);
                return range.getBoundingClientRect().width;
            }""",
            slot,
        )

    def clamps(self, slot):
        """Whether the template cuts this placeholder off, and how.

        Not every template clamps its title - one of them deliberately lets a
        long title wrap instead - so tests about shortening ask first.
        """
        return self.page.evaluate(
            """(slot) => {
                const frame = window.__bkg.exportFrame();
                const el = frame.contentDocument.querySelector(`[data-slot="${slot}"]`);
                if (!el) return null;
                const style = frame.contentWindow.getComputedStyle(el);
                const lines = style.getPropertyValue('-webkit-line-clamp');
                return {
                  lines: lines && lines !== 'none' ? Number(lines) : null,
                  line: style.textOverflow === 'ellipsis',
                };
            }""",
            slot,
        )

    def stage_text(self, slot):
        """The text sitting in the export stage right now."""
        return self.page.evaluate(
            """(slot) => {
                const frame = window.__bkg.exportFrame();
                const el = frame.contentDocument.querySelector(`[data-slot="${slot}"]`);
                return el ? el.textContent : null;
            }""",
            slot,
        )


@pytest.fixture
def app(_page):
    page, errors = _page
    kit = BrandKit(page, errors).reset()
    yield kit
    assert not errors, f"the page raised: {errors}"


@pytest.fixture(scope="session")
def catalogue(_page):
    """Templates and formats, read from the running app rather than hard-coded."""
    page, errors = _page
    kit = BrandKit(page, errors)
    return {"templates": kit.templates, "formats": kit.formats, "fonts": kit.fonts}


def pytest_generate_tests(metafunc):
    """Turns the catalogue into test parameters.

    `template_id` covers every template, `titled_template_id` only those with a
    title placeholder, `format_id` every output format and `font_id` every
    bundled family.

    The lists come from the app itself, so a new template or format is covered
    the moment it is added to the manifest.
    """
    names = set(metafunc.fixturenames)
    wanted = {"template_id", "titled_template_id", "format_id", "font_id"} & names
    # A test may narrow one of these itself with its own parametrize marker.
    for marker in metafunc.definition.iter_markers("parametrize"):
        wanted -= {name.strip() for name in str(marker.args[0]).split(",")}
    if not wanted:
        return
    listing = _read_catalogue()
    if "template_id" in wanted:
        metafunc.parametrize("template_id", [t["id"] for t in listing["templates"]])
    if "titled_template_id" in wanted:
        metafunc.parametrize(
            "titled_template_id",
            [t["id"] for t in listing["templates"] if "title" in t["slots"]],
        )
    if "format_id" in wanted:
        metafunc.parametrize("format_id", [f["id"] for f in listing["formats"]])
    if "font_id" in wanted:
        metafunc.parametrize("font_id", listing["fonts"])


@functools.lru_cache(maxsize=1)
def _read_catalogue():
    """Reads the catalogue from the source files, for collection time.

    Parametrisation happens before any fixture runs, so this cannot go through
    the browser. It reads the same manifest the app reads.
    """
    manifest = json.loads((SRC / "templates" / "manifest.json").read_text(encoding="utf-8"))
    listed = manifest if isinstance(manifest, list) else manifest["templates"]
    templates = []
    for entry in listed:
        path = SRC / "templates" / entry if "/" not in entry else SRC / entry
        markup = path.read_text(encoding="utf-8")
        slots = set(_attr_values(markup, "data-slot")) | set(_attr_values(markup, "data-show-if"))
        templates.append({"id": path.stem, "slots": sorted(slots)})

    constants = (SRC / "constants.js").read_text(encoding="utf-8")
    formats = [{"id": value} for value in _string_field(constants, "SOCIAL_FORMATS", "id")]
    fonts = _string_field((SRC / "fonts.js").read_text(encoding="utf-8"), "FONTS", "id")
    return {"templates": templates, "formats": formats, "fonts": fonts}


def _attr_values(markup, attribute):
    return re.findall(rf'{attribute}="([^"]+)"', markup)


def _string_field(source, array_name, field):
    """The `field: 'value'` entries of a literal array in a source file."""
    start = source.index(f"const {array_name} = [")
    depth, end = 0, start
    for index in range(source.index("[", start), len(source)):
        if source[index] == "[":
            depth += 1
        elif source[index] == "]":
            depth -= 1
            if depth == 0:
                end = index
                break
    return re.findall(rf"{field}:\s*'([^']+)'", source[start:end])
