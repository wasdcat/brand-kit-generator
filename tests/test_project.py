"""Checks on the sources themselves. No browser, so these run in a blink.

They cover the kind of slip that is easy to make and hard to notice: a version
number left behind in one of the five places it is written down, a string added
to one language and not the other, or an interface message written into the
code instead of looked up.
"""

import json
import re
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Deliberately the same in every language - the name of the application.
UNTRANSLATED = {"app.title"}


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


# -- version --------------------------------------------------------------


def app_version():
    return re.search(r"const APP_VERSION = '([^']+)'", read("src/constants.js")).group(1)


@pytest.mark.parametrize(
    "path, pattern",
    [
        ("README.md", r"badge/version-([0-9][^-]*)-blue"),
        ("docs/manual/de/markpublish.yaml", r'version:\s*"([^"]+)"'),
        ("docs/manual/en/markpublish.yaml", r'version:\s*"([^"]+)"'),
        ("CHANGELOG.md", r"##\s*\[([0-9][^\]]*)\]"),
    ],
)
def test_the_version_is_the_same_everywhere(path, pattern):
    """constants.js is the one place it is written down - but not the only place
    it appears, and the others drift."""
    found = re.search(pattern, read(path))
    assert found, f"no version found in {path}"
    assert found.group(1) == app_version(), f"{path} still says {found.group(1)}"


def test_the_changelog_describes_the_current_version():
    heading = re.search(r"##\s*\[([0-9][^\]]*)\]\s*-\s*(\S+)", read("CHANGELOG.md"))
    assert heading.group(1) == app_version()
    assert re.fullmatch(r"\d{4}-\d{2}-\d{2}", heading.group(2)), "the entry has no date"


# -- interface strings ----------------------------------------------------


def i18n_tables():
    """The language tables, read out of the source without running it."""
    source = read("src/i18n.js")
    tables = {}
    for language in re.findall(r"^\s*const (\w{2}) = \{$", source, re.MULTILINE):
        block = source.split(f"const {language} = {{", 1)[1].split("\n  };", 1)[0]
        tables[language] = set(re.findall(r"^\s*'([\w.]+)':", block, re.MULTILINE))
    return tables


def test_both_languages_carry_the_same_keys():
    tables = i18n_tables()
    assert set(tables) == {"en", "de"}, f"unexpected languages: {sorted(tables)}"

    missing = (tables["en"] - tables["de"]) - UNTRANSLATED
    extra = tables["de"] - tables["en"]
    assert not missing, f"not translated into German: {sorted(missing)}"
    assert not extra, f"German only, with no English fallback: {sorted(extra)}"


def test_the_export_status_is_never_written_into_the_code():
    """The three messages shown while an export runs were literals once, which
    left the interface half German and half English either way round."""
    literals = re.findall(
        r"exportStatusText\.value\s*=\s*([^;]+);", read("src/app.js")
    )
    assert literals, "the export no longer reports its status"
    for value in literals:
        value = value.strip()
        if value in ("''", '""'):
            continue  # clearing it when the export is over
        assert value.startswith("t("), f"status text written into the code: {value}"


def test_no_interface_string_is_left_unused():
    """The other direction: a key nobody asks for.

    That is usually a control whose wording was written into the markup
    instead - the load button sat without its tooltip that way, and the note
    in the template area stayed English in the German interface. Keys that are
    built up at runtime, like `t('format.' + id)`, count through their prefix.
    """
    keys = i18n_tables()["en"]
    sources = "".join(
        path.read_text(encoding="utf-8")
        for path in [SRC / "app.js", SRC / "index.html", *sorted((SRC / "panels").glob("*.html"))]
    )
    quoted = set(re.findall(r"'([\w.]+)'", sources))
    prefixes = set(re.findall(r"t\('([\w.]*\.)'\s*\+", sources))

    unused = sorted(
        key
        for key in keys
        if key not in quoted and not any(key.startswith(prefix) for prefix in prefixes)
    )
    assert not unused, f"in i18n.js but never asked for: {unused}"


def test_no_interface_string_is_left_in_the_markup():
    """Anything a user reads comes from i18n.js, so the panels only call t()."""
    keys = i18n_tables()["en"]
    used = set()
    for path in [SRC / "index.html", *sorted((SRC / "panels").glob("*.html"))]:
        # the lookbehind keeps usesSlot('title') and the like out of it
        used |= set(re.findall(r"(?<![\w.])t\('([\w.]+)'", path.read_text(encoding="utf-8")))
    unknown = used - keys
    assert not unknown, f"the markup asks for keys that do not exist: {sorted(unknown)}"


# -- templates ------------------------------------------------------------


def template_files():
    manifest = json.loads((SRC / "templates" / "manifest.json").read_text(encoding="utf-8"))
    listed = manifest if isinstance(manifest, list) else manifest["templates"]
    return [SRC / "templates" / entry if "/" not in entry else SRC / entry for entry in listed]


def test_every_listed_template_exists_and_has_a_frame():
    for path in template_files():
        assert path.exists(), f"{path.name} is in the manifest but not on disk"
        markup = path.read_text(encoding="utf-8")
        assert 'class="frame"' in markup, f"{path.name} has no element with class=frame"


def test_every_template_placeholder_is_one_the_app_knows():
    known = set(re.findall(r"\{ key: '([\w.]+)'", read("src/constants.js")))
    for path in template_files():
        markup = path.read_text(encoding="utf-8")
        used = set(re.findall(r'data-slot="([\w.]+)"', markup))
        used |= set(re.findall(r'data-show-if="([\w.]+)"', markup))
        unknown = used - known
        assert not unknown, f"{path.name} uses unknown placeholders: {sorted(unknown)}"


def test_every_clamped_placeholder_states_its_line_height():
    """The export measures against the line-height to decide whether text is cut
    off. A clamped element without one would be measured against `normal`,
    which is a guess."""
    for path in template_files():
        markup = path.read_text(encoding="utf-8")
        for block in re.findall(r"\.([\w-]+)\s*\{([^}]*)\}", markup):
            selector, body = block
            clamped = "-webkit-line-clamp" in body or "text-overflow: ellipsis" in body
            if clamped:
                assert "line-height" in body, (
                    f"{path.name}: .{selector} is clamped but sets no line-height"
                )
