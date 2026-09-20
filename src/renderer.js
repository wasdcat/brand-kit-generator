/**
 * WASDCAT Brand Kit Generator - HTML template renderer
 *
 * A template is an ordinary HTML page (templates/*.html). It is loaded into an
 * iframe so that its CSS stays completely separate from the app and looks
 * exactly as it does when the file is opened directly.
 *
 * The app sets on the .frame element:
 *   - width/height and data-format ("1:1", "4:5", "9:16", "16:9")
 *   - the CSS variables --color-<role> (colour set), --<object>-color (which
 *     role a design object uses) and, per placeholder, --font-<slot>,
 *     --font-<slot>-weight and --font-<slot>-axes (font set plus the mapping
 *     from the Template area). Sizes stay with the template.
 *   - the content of every [data-slot] element; [data-show-if] hides elements
 *     whose reference value is empty
 *
 * Fonts ship with the project (fonts/fonts.css), which every template links
 * itself. Nothing is fetched from a font CDN, so there is no cross-origin
 * stylesheet to work around: the export library can read the @font-face rules
 * directly and embeds the real glyphs instead of substitutes.
 *
 * Export: modern-screenshot renders .frame inside the iframe to a transparent PNG.
 */
(function () {
  const { SLOTS, COLOR_ASSIGNMENTS, fontVar } = window.BKG_CONSTANTS;

  // Local bundled vendor script (relative to templates/*.html)
  const SCREENSHOT_LIB = '../vendor/modern-screenshot.js';
  const SLOT_KEYS = new Set(SLOTS.map(s => s.key));

  // Injected into every template. Empty text fields disappear, and the page gets
  // no background of its own so that transparency is preserved.
  //
  // color-scheme is deliberate and must follow the app: CSS Color Adjust makes a
  // frame whose used colour scheme differs from its embedder paint an opaque
  // Canvas instead of staying see-through. With the app on `dark` and the
  // template on `normal` the preview iframe turns solid white and hides the
  // stage behind it - the transparency grid, the black/white backgrounds and the
  // background image all stop being visible. syncColorScheme() keeps the two in step.
  const BASE_CSS = `
    html, body { margin: 0 !important; padding: 0 !important; background: transparent !important; overflow: hidden !important; }
    [hidden] { display: none !important; }
    [data-slot]:not(img):empty { display: none !important; }
  `;

  // The colour scheme the app itself renders in, as a value color-scheme accepts.
  const embedderColorScheme = () => {
    const used = getComputedStyle(document.documentElement).colorScheme;
    return used && used !== 'normal' ? used : 'light';
  };

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // requestAnimationFrame with a timeout fallback (invisible iframes get throttled)
  const nextFrame = (win) => Promise.race([
    new Promise(resolve => win.requestAnimationFrame(() => resolve())),
    wait(100)
  ]);

  /** Values for every placeholder, taken from company, product and content. */
  function slotValues({ company, product, content }) {
    return {
      'title': content.title || '',
      'subtitle': content.subtitle || '',
      'description': content.description || '',
      'tag': content.tag || '',
      'tag2': content.tag2 || '',
      'product.title': product.title || '',
      'product.slogan': product.slogan || '',
      'product.logo': product.logo || '',
      'company.name': company.name || '',
      'company.slogan': company.slogan || '',
      'company.copyright': company.copyright || '',
      'company.logo': company.logo || ''
    };
  }

  /**
   * Shortens text that gets cut off by line-clamp or text-overflow to real text
   * with an ellipsis. The export would otherwise lose the dots that the browser
   * draws in the preview. Returns a function that restores the original text.
   */
  function clampOverflowingText(root, win) {
    const changed = [];
    for (const el of root.querySelectorAll('[data-slot]')) {
      if (el.tagName === 'IMG' || !el.textContent || el.children.length) continue;
      const style = win.getComputedStyle(el);
      if (style.display === 'none') continue;

      const lineClamp = style.getPropertyValue('-webkit-line-clamp');
      const clampsLines = lineClamp && lineClamp !== 'none';
      const clampsLine = style.textOverflow === 'ellipsis';
      if (!clampsLines && !clampsLine) continue;

      // scrollHeight and scrollWidth report the overflow of the font's own
      // ascent and descent, not of the visible glyphs. A line-height below the
      // height of that box - 1.06 in the title card - therefore leaves a few
      // pixels of overhang on every single line, whether or not anything is
      // being cut off. Measured against a one-pixel tolerance every clamped
      // element looks like it overflows, the search below then finds no length
      // that fits (the overhang is the same for one character as for a hundred)
      // and the text is put back unshortened - the ellipsis never appears.
      // The tolerance has to swallow that overhang and stay under what one cut
      // line adds, which half a line does in the block direction. Inline it is
      // a slanted or swashed glyph that hangs over, well under a quarter em.
      const fontSize = parseFloat(style.fontSize) || 0;
      const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2;
      const slack = clampsLines ? lineHeight / 2 : fontSize / 4;
      const overflows = () => (clampsLines
        ? el.scrollHeight > el.clientHeight + slack
        : el.scrollWidth > el.clientWidth + slack);
      if (!overflows()) continue;

      const original = el.textContent;
      let lo = 0;
      let hi = original.length;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        el.textContent = original.slice(0, mid).trimEnd() + '…';
        if (overflows()) hi = mid - 1; else lo = mid;
      }
      if (lo <= 0) {
        el.textContent = original;
        continue;
      }
      // Cut at a word boundary where possible
      let cut = original.slice(0, lo);
      const space = cut.lastIndexOf(' ');
      if (space > cut.length * 0.6) cut = cut.slice(0, space);
      const trimmed = cut.trimEnd();
      if (!trimmed) {
        el.textContent = original;
        continue;
      }
      el.textContent = trimmed + '…';
      changed.push([el, original]);
    }
    return () => changed.forEach(([el, text]) => { el.textContent = text; });
  }

  const TEMPLATE_MANIFEST = 'templates/manifest.json';

  /**
   * Reads which templates exist from templates/manifest.json, so adding one is a
   * file plus a line in that manifest rather than an edit in constants.js. The
   * listed names are relative to the manifest and come back as usable paths.
   * `fallback` is used whenever the manifest is missing or unreadable, which
   * keeps the app running on the templates the code knows about.
   */
  async function loadTemplateFiles(fallback = []) {
    const base = TEMPLATE_MANIFEST.replace(/[^/]+$/, '');
    try {
      const res = await fetch(TEMPLATE_MANIFEST, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const listed = Array.isArray(data) ? data : data.templates;
      if (!Array.isArray(listed)) throw new Error('No "templates" array in the manifest.');
      const files = listed
        .filter(entry => typeof entry === 'string' && entry.trim())
        .map(entry => (entry.includes('/') ? entry.trim() : base + entry.trim()));
      if (!files.length) throw new Error('The manifest lists no templates.');
      return files;
    } catch (err) {
      console.warn(`[templates] ${TEMPLATE_MANIFEST} unusable (${err.message}); using the built-in list.`);
      return fallback;
    }
  }

  /**
   * Loads every template file and reads out its name, description, category and
   * the placeholders it uses.
   */
  async function loadTemplateCatalog(files) {
    return Promise.all(files.map(async (file) => {
      const id = file.split('/').pop().replace(/\.html?$/i, '');
      try {
        const res = await fetch(file, { cache: 'no-store' });
        if (!res.ok) throw new Error(`File not found (HTTP ${res.status})`);
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        const meta = (name) => (doc.querySelector(`meta[name="${name}"]`) || {}).content || '';
        const used = new Set();
        doc.querySelectorAll('[data-slot]').forEach(el => used.add(el.dataset.slot));
        doc.querySelectorAll('[data-show-if]').forEach(el => used.add(el.dataset.showIf));
        const slots = [...used];
        return {
          id,
          file,
          name: (doc.title || id).trim(),
          description: meta('description'),
          category: meta('category'),
          slots,
          unknownSlots: slots.filter(key => !SLOT_KEYS.has(key)),
          error: doc.querySelector('.frame') ? '' : 'The template has no element with class="frame".'
        };
      } catch (err) {
        return { id, file, name: id, description: '', category: '', slots: [], unknownSlots: [], error: err.message };
      }
    }));
  }

  /**
   * Stage for one template inside an iframe. The app runs two stages: the
   * visible preview and an invisible one for the export, so that the preview
   * does not jump around while several formats are exported to a ZIP.
   */
  class TemplateStage {
    constructor(iframe, { sizeIframe = false } = {}) {
      this.iframe = iframe;
      this.sizeIframe = sizeIframe;
      this.file = null;
      this.ready = null;
      this.loadToken = 0;
      this.applyToken = 0;
      this.libPromise = null;
      this.libDoc = null;
    }

    get doc() { return this.iframe.contentDocument; }
    get win() { return this.iframe.contentWindow; }
    get frame() { return this.doc && this.doc.querySelector('.frame'); }

    /** Loads a template file. Repeated calls with the same file do not reload. */
    load(file, { force = false } = {}) {
      if (!force && this.file === file && this.ready) return this.ready;
      const token = ++this.loadToken;
      this.file = file;
      this.libPromise = null;
      this.ready = new Promise((resolve, reject) => {
        const onLoad = async () => {
          if (token !== this.loadToken) return;
          this.iframe.removeEventListener('load', onLoad);
          try {
            await this.prepare();
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        this.iframe.addEventListener('load', onLoad);
        const separator = file.includes('?') ? '&' : '?';
        this.iframe.src = `${file}${separator}t=${Date.now()}`;
      });
      // Do not report errors as "unhandled"; the caller receives them through await
      this.ready.catch(() => {});
      return this.ready;
    }

    reload() {
      return this.load(this.file, { force: true });
    }

    async prepare() {
      const doc = this.doc;
      if (!doc || !doc.querySelector('.frame')) {
        throw new Error(`Template "${this.file}" could not be loaded or has no element with class="frame".`);
      }

      const base = doc.createElement('style');
      base.setAttribute('data-bkg', 'base');
      base.textContent = BASE_CSS;
      doc.head.appendChild(base);

      this.syncColorScheme();
    }

    /**
     * Matches the template's colour scheme to the app's. Without this the iframe
     * stops being transparent as soon as the two differ (see BASE_CSS). Safe to
     * call at any time; the app calls it again whenever the theme changes.
     */
    syncColorScheme() {
      const doc = this.doc;
      if (!doc || !doc.documentElement) return;
      doc.documentElement.style.colorScheme = embedderColorScheme();
    }

    /**
     * Sets format, colours, fonts and every placeholder, then waits until fonts
     * and images are ready.
     * state: { format, colors, assign, typography, company, product, content }
     */
    async apply(state) {
      const token = ++this.applyToken;
      await this.ready;
      if (token !== this.applyToken) return;
      const frame = this.frame;
      if (!frame) throw new Error('Template is not loaded.');
      const { format, colors, assign = {}, typography = {} } = state;

      if (this.sizeIframe) {
        this.iframe.style.width = `${format.width}px`;
        this.iframe.style.height = `${format.height}px`;
      }
      frame.dataset.format = format.id;
      frame.style.width = `${format.width}px`;
      frame.style.height = `${format.height}px`;

      for (const [role, value] of Object.entries(colors)) {
        frame.style.setProperty(`--color-${role}`, value);
      }
      // Assignment: point at the role rather than at its hex value, so the
      // declaration stays readable in the template. If the colour set does not
      // know the role, the variable stays unset and the template fallback applies.
      for (const { key } of COLOR_ASSIGNMENTS) {
        const role = assign[key];
        frame.style.setProperty(`--${key}-color`, colors[role] ? `var(--color-${role})` : '');
      }
      // Typography. Every bundled family is already declared in fonts/fonts.css,
      // so the name is all that is needed - nothing is loaded on demand. Each
      // placeholder gets three variables; the template picks them up with its own
      // values as the fallback, which is what keeps older templates working.
      frame.style.setProperty('--font-base', typography.base ? `"${typography.base}"` : '');
      for (const [key, spec] of Object.entries(typography.slots || {})) {
        const name = fontVar(key);
        frame.style.setProperty(name, `"${spec.font}"`);
        frame.style.setProperty(`${name}-weight`, String(spec.weight));
        frame.style.setProperty(`${name}-axes`, spec.axes || 'normal');
      }

      const values = slotValues(state);
      for (const el of frame.querySelectorAll('[data-slot]')) {
        const value = values[el.dataset.slot];
        if (value === undefined) continue; // unknown placeholder: leave the sample content alone
        if (el.tagName === 'IMG') {
          el.hidden = !value;
          if (value && el.getAttribute('src') !== value) el.setAttribute('src', value);
        } else if (el.textContent !== value) {
          el.textContent = value;
        }
      }
      for (const el of frame.querySelectorAll('[data-show-if]')) {
        const value = values[el.dataset.showIf];
        if (value !== undefined) el.hidden = !value;
      }

      await this.settle();
      if (token !== this.applyToken) return;
    }

    async settle() {
      const win = this.win;
      const doc = this.doc;
      await nextFrame(win);
      await nextFrame(win);
      try { await doc.fonts.ready; } catch (e) { /* ignore */ }
      const images = [...this.frame.querySelectorAll('img')].filter(img => !img.hidden && img.getAttribute('src'));
      await Promise.all(images.map(img => (img.decode ? img.decode().catch(() => {}) : Promise.resolve())));
    }

    ensureLibrary() {
      if (this.win.modernScreenshot) return Promise.resolve();
      if (this.libPromise && this.libDoc === this.doc) return this.libPromise;
      this.libDoc = this.doc;
      this.libPromise = new Promise((resolve, reject) => {
        const script = this.doc.createElement('script');
        script.src = SCREENSHOT_LIB;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('The export library (modern-screenshot) could not be loaded.'));
        this.doc.head.appendChild(script);
      });
      return this.libPromise;
    }

    /** Renders the currently applied template as a transparent PNG. */
    async exportBlob(format) {
      await this.ready;
      await this.ensureLibrary();
      const restore = clampOverflowingText(this.frame, this.win);
      try {
        return await this.win.modernScreenshot.domToBlob(this.frame, {
          width: format.width,
          height: format.height,
          scale: 1,
          backgroundColor: null,
          type: 'image/png'
        });
      } finally {
        restore();
      }
    }
  }

  window.BKG_RENDERER = {
    TemplateStage,
    loadTemplateFiles,
    loadTemplateCatalog
  };
})();
