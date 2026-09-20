/**
 * WASDCAT Brand Kit Generator - main application controller
 */
(function () {
  const {
    APP_VERSION,
    SOCIAL_FORMATS,
    COLOR_ROLES,
    COLOR_ASSIGNMENTS,
    ASSIGNABLE_ROLES,
    DEFAULT_ASSIGN,
    TEMPLATE_FILES,
    SLOTS,
    DEFAULT_COMPANY,
    DEFAULT_PRODUCTS,
    DEFAULT_COLORSETS,
    DEFAULT_FONTSETS,
    TYPO_DEFAULTS,
    DEFAULT_CONTENT,
    DEFAULT_SELECTION,
    DEFAULT_PRODUCT_LOGO,
    DEFAULT_ID,
    MENU_GROUPS
  } = window.BKG_CONSTANTS;

  const { TemplateStage, loadTemplateFiles, loadTemplateCatalog } = window.BKG_RENDERER;
  const FONTS = window.BKG_FONTS;
  const { LANGS, detect: detectLang, translate } = window.BKG_I18N;

  const { createApp, ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } = Vue;

  const clone = (value) => JSON.parse(JSON.stringify(value));

  // Identity of a saved setup, in localStorage as well as in an exported .json.
  // Every setup carries both, so a file can be recognised before anything of it
  // is applied.
  const CONFIG_ID = 'wasdcat-bkg-config';
  // Raised only when the format changes in a way older data cannot survive. The
  // storage key below stays as it is; the version in the payload is what decides.
  const CONFIG_VERSION = '1.0';
  const CONFIG_MAJOR = parseInt(CONFIG_VERSION, 10);
  // The areas a setup is made of, used to summarise a file before importing it.
  const SETUP_KEYS = ['company', 'products', 'colorSets', 'fontSets', 'typography', 'content', 'selection', 'hiddenTemplates', 'background'];
  const SELECTION_KEYS = ['productId', 'templateId', 'colorSetId', 'fontSetId'];

  // Links in the bottom bar. Only the targets live here; the wording comes from
  // the language. An entry whose href is empty is left out rather than rendered
  // as a dead link, which is why the imprint stays hidden until its address is
  // filled in below.
  //
  // The manual is built from docs/manual/<lang>/ and served by the app itself,
  // so it is at hand offline. The build command is in that folder's
  // markpublish.yaml. {lang} is replaced with the active language.
  const FOOTER_LINKS = [
    { id: 'project', href: 'https://github.com/wasdcat/brand-kit-generator' },
    { id: 'manual', href: 'docs/manual/brand_kit_generator_{lang}.pdf' },
    { id: 'licence', href: 'https://github.com/wasdcat/brand-kit-generator/blob/main/LICENSE' },
    { id: 'imprint', href: '' }
  ];

  // One slot, not a versioned one. What is stored says which version it is, so
  // there is no reason to rename the slot and drop the setup along with it.
  const STORAGE_KEY = 'wasdcat_bkg_setup';
  const THEME_KEY = 'wasdcat_bkg_theme';
  const LANG_KEY = 'wasdcat_bkg_lang';
  const THEMES = ['dark', 'light'];
  const FONT_IDS = new Set(FONTS.map(f => f.id));
  const DEFAULT_FONT = FONTS[0].id;
  const TEXT_SLOTS = SLOTS.filter(slot => slot.type === 'text');

  // Weight range a family supports, from its `weight` entry in fonts.js
  const weightRange = (fontId) => {
    const font = FONTS.find(f => f.id === fontId);
    const parts = String((font || {}).weight || '100 900').split(' ').map(Number);
    return [parts[0] || 100, parts[1] || 900];
  };

  // Axis values of a variation as a font-variation-settings value
  const axesToCss = (axes) => Object.entries(axes || {})
    .map(([tag, value]) => `"${tag}" ${value}`)
    .join(', ');

  // Stand-in entry until the template file has been read
  const templateStub = (file) => ({
    id: file.split('/').pop().replace(/\.html?$/i, ''),
    file,
    name: file,
    description: '',
    category: '',
    slots: [],
    unknownSlots: [],
    error: ''
  });

  const app = createApp({
    setup() {
      // -----------------------------------------------------------------------
      // State
      // -----------------------------------------------------------------------
      const company = reactive(clone(DEFAULT_COMPANY));
      const products = reactive(clone(DEFAULT_PRODUCTS));
      const colorSets = reactive(clone(DEFAULT_COLORSETS));
      const fontSets = reactive(clone(DEFAULT_FONTSETS));
      const typography = reactive(clone(TYPO_DEFAULTS));
      const templates = reactive(TEMPLATE_FILES.map(templateStub));
      // Templates are files, so removing one cannot delete anything from disk -
      // it takes the entry out of the catalogue and remembers that. The file
      // stays where it is and the Template area can bring it back.
      const hiddenTemplates = reactive([]);
      const content = reactive(clone(DEFAULT_CONTENT));
      const selection = reactive(clone(DEFAULT_SELECTION));

      // Language of the interface. An explicit choice wins over what the browser
      // reports; English is the fallback for both. Like the theme it is a setting
      // of the workplace, not of the brand, so it lives next to the setup rather
      // than inside it.
      const lang = ref((() => {
        try {
          const saved = localStorage.getItem(LANG_KEY);
          if (LANGS.includes(saved)) return saved;
        } catch (e) { /* private mode */ }
        return detectLang();
      })());

      const t = (key, vars) => translate(lang.value, key, vars);

      const setLang = (next) => {
        if (!LANGS.includes(next) || next === lang.value) return;
        lang.value = next;
        try { localStorage.setItem(LANG_KEY, next); } catch (e) { /* private mode */ }
        document.documentElement.setAttribute('lang', next);
        nextTick(refreshIcons);
      };

      const toggleLang = () => {
        const i = LANGS.indexOf(lang.value);
        setLang(LANGS[(i + 1) % LANGS.length]);
      };

      // What the language switch shows: the language it would move to.
      const nextLangLabel = computed(() => {
        const i = LANGS.indexOf(lang.value);
        return LANGS[(i + 1) % LANGS.length].toUpperCase();
      });

      const currentFormat = ref(SOCIAL_FORMATS[0]);
      const editingColorSetId = ref(DEFAULT_SELECTION.colorSetId);
      const editingFontSetId = ref(DEFAULT_SELECTION.fontSetId);

      // Preview
      const stageAreaRef = ref(null);
      const previewFrameRef = ref(null);
      const exportFrameRef = ref(null);
      const stageSize = reactive({ width: 800, height: 600 });
      const templateError = ref('');
      const isPreviewLoading = ref(true);
      // Which stylesheet under theme/ is linked. An interface preference, so it
      // is kept next to the setup rather than inside it - the same call as for
      // the preview background.
      const theme = ref('dark');
      // A theme switch changes the app's color-scheme, and a template iframe only
      // stays transparent while its own scheme matches. The new stylesheet lands
      // asynchronously, so the stages are re-synced once it has actually loaded.
      const syncStageColorSchemes = () => {
        if (previewStage) previewStage.syncColorScheme();
        if (exportStage) exportStage.syncColorScheme();
      };
      const applyTheme = () => {
        const link = document.getElementById('theme-stylesheet');
        // Cache-busted like the template loader: a theme is meant to be edited in
        // the file, and an edit has to show up on a normal reload.
        if (link) {
          link.addEventListener('load', syncStageColorSchemes, { once: true });
          link.setAttribute('href', `theme/${theme.value}.css?t=${Date.now()}`);
        }
        try { localStorage.setItem(THEME_KEY, theme.value); } catch (e) { /* private mode */ }
        // lucide has replaced the <i> with an <svg>, so the name is set on
        // whatever is in the document now and re-rendered from there.
        const themeIcon = document.querySelector('[data-theme-icon]');
        if (themeIcon) themeIcon.setAttribute('data-lucide', theme.value === 'dark' ? 'sun' : 'moon');
        nextTick(refreshIcons);
      };
      const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark';
        applyTheme();
      };

      const bgMode = ref('checkerboard-dark');
      const customBgUrl = ref(null);
      // Name of the file the background came from. A setup can be saved without
      // the image itself, and then this is all that is left to ask for.
      const bgName = ref('');
      // Framing of the background image, one row per template and format.
      //
      // Both matter. A template decides where it puts its ink - a scrim along
      // the bottom, a bug in a corner - and the picture is framed around that.
      // A format decides the shape it is cut to, and a portrait crop of a
      // landscape photograph sits nowhere near where the landscape crop sits.
      //
      // The offset is a fraction of the frame width and height rather than a
      // pixel value, so a row survives a change of window size and with it of
      // previewScale, and carries from the scaled preview to the full-size
      // export untouched.
      const bgFraming = reactive({});           // templateId -> formatId -> { x, y, zoom }
      const DEFAULT_FRAMING = Object.freeze({ x: 0, y: 0, zoom: 1 });
      const bgNatural = reactive({ width: 0, height: 0 });
      const isBgDragging = ref(false);
      // Set when an imported setup named a background but did not carry it. The
      // framing is already in place, so the file that is picked next has to slot
      // into it rather than reset it the way a fresh picture does.
      const awaitedBgName = ref('');

      // UI
      const appVersion = APP_VERSION;
      const footerLinks = computed(() => FOOTER_LINKS
        .filter(link => link.href)
        .map(link => ({
          id: link.id,
          href: link.href.replace('{lang}', lang.value),
          label: t('footer.' + link.id),
          title: t('footer.' + link.id + 'Title')
        })));
      const activeTab = ref('workflow');
      const isExporting = ref(false);
      const exportStatusText = ref('');
      const exportProgressPercent = ref(0);
      // tone decides the colour: 'ok' for something that worked, 'warn' for an
      // action that cannot run right now, 'error' for something that failed or
      // was refused.
      const toast = reactive({ visible: false, message: '', tone: 'ok' });
      const selectedFormats = ref(SOCIAL_FORMATS.map(f => f.id));

      // Destructive buttons ask once: the first click arms the button, a second
      // one within a few seconds carries the action out. Anything else - the
      // timeout, another button, a tab change - disarms it again.
      const pendingConfirm = ref('');
      let confirmTimer = null;
      const askConfirm = (key, action) => {
        if (confirmTimer) clearTimeout(confirmTimer);
        if (pendingConfirm.value === key) {
          pendingConfirm.value = '';
          action();
          return;
        }
        pendingConfirm.value = key;
        confirmTimer = setTimeout(() => { pendingConfirm.value = ''; }, 4000);
      };

      let toastTimer = null;
      // showToast('Done.') or showToast('Failed.', { tone: 'error', duration: 5000 })
      const showToast = (msg, { tone = 'ok', duration = tone === 'ok' ? 3000 : 4500 } = {}) => {
        toast.message = msg;
        toast.tone = tone;
        toast.visible = true;
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { toast.visible = false; }, duration);
      };

      // Colours per tone, built the same way throughout: the border at 500/50, the
      // dot at 500, the text at 200. Only the pulse is reserved for 'ok', where it
      // reads as "just happened" rather than as an alarm.
      const TOAST_TONES = {
        ok:    { box: 'border-ok-500/50',     dot: 'bg-ok-500 animate-pulse', text: 'text-ok-200' },
        warn:  { box: 'border-warn-500/50',   dot: 'bg-warn-500',             text: 'text-warn-200' },
        error: { box: 'border-danger-500/50', dot: 'bg-danger-500',           text: 'text-danger-200' }
      };
      const toastStyle = computed(() => TOAST_TONES[toast.tone] || TOAST_TONES.ok);

      // -----------------------------------------------------------------------
      // Resolving the selection
      // -----------------------------------------------------------------------
      const activeProduct = computed(() =>
        products.find(p => p.id === selection.productId) || products[0]);

      const activeTemplate = computed(() =>
        templates.find(t => t.id === selection.templateId) || templates[0]);

      const activeColorSet = computed(() =>
        colorSets.find(c => c.id === selection.colorSetId) || colorSets[0]);

      const editingColorSet = computed(() =>
        colorSets.find(c => c.id === editingColorSetId.value) || colorSets[0]);

      const activeFontSet = computed(() =>
        fontSets.find(f => f.id === selection.fontSetId) || fontSets[0]);

      const editingFontSet = computed(() =>
        fontSets.find(f => f.id === editingFontSetId.value) || fontSets[0]);

      const resolvedColors = computed(() =>
        Object.assign({}, DEFAULT_COLORSETS[0].colors, activeColorSet.value ? activeColorSet.value.colors : {}));

      // Which role a design object uses in the active colour set
      const resolvedAssign = computed(() =>
        Object.assign({}, DEFAULT_ASSIGN, activeColorSet.value ? activeColorSet.value.assign : {}));

      // Wording for the data model. constants.js and fonts.js carry only keys;
      // what is read on screen comes from the language table.
      const roleLabel = (key) => t('role.' + key);
      const roleHint = (key) => t('role.' + key + '.hint');
      const assignLabel = (key) => t('assign.' + key);
      const slotLabel = (key) => t('slot.' + key);
      const slotSource = (source) => t('slotSource.' + String(source).toLowerCase());
      const formatName = (fmt) => t('format.' + fmt.id);
      const menuGroupLabel = (group) => t('menu.group.' + group.id);
      const menuItemLabel = (item) => t('menu.item.' + item.id);
      const axisLabel = (tag) => t('axis.' + tag);
      const axisHint = (tag) => t('axis.' + tag + '.hint');
      const fontNote = (id) => t('font.' + id + '.note');

      // Which variable axes a family offers (fonts.js). Empty for most of them.
      const fontAxes = (id) => (FONTS.find(f => f.id === id) || {}).axes || [];

      // Looks up a variation in the active font set. A mapping pointing at a
      // variation the set does not have falls back to its first one, so
      // switching font sets never leaves a placeholder without a typeface.
      const variationOf = (id, set) => {
        const list = ((set || activeFontSet.value) || {}).variations || [];
        return list.find(v => v.id === id) || list[0] || { font: DEFAULT_FONT, axes: {} };
      };

      // What the renderer writes onto the frame: family, weight and axes per
      // placeholder. Size is not part of it - that stays in the template CSS.
      const resolvedTypography = computed(() => {
        const slots = {};
        for (const slot of TEXT_SLOTS) {
          const row = typography[slot.key] || TYPO_DEFAULTS[slot.key] || { variation: '', weight: 400 };
          const variation = variationOf(row.variation);
          const [min, max] = weightRange(variation.font);
          slots[slot.key] = {
            font: variation.font,
            weight: Math.min(max, Math.max(min, Number(row.weight) || min)),
            axes: axesToCss(variation.axes)
          };
        }
        // Anything the template does not map to a placeholder uses the Default
        // variation - the one every font set is guaranteed to carry.
        return { base: variationOf(DEFAULT_ID).font, slots };
      });

      // The rows shown in the Template area: only the text placeholders the
      // active template actually declares.
      const typoRows = computed(() => TEXT_SLOTS
        .filter(slot => activeTemplate.value.slots.includes(slot.key))
        .map(slot => {
          const row = typography[slot.key];
          const variation = variationOf(row.variation);
          const [min, max] = weightRange(variation.font);
          return { key: slot.key, label: slotLabel(slot.key), row, font: variation.font, min, max };
        }));

      // Which placeholders does the active template use? (for hints in Creation)
      const usesSlot = (key) => activeTemplate.value.slots.includes(key);

      const previewScale = computed(() => {
        const fmt = currentFormat.value;
        const scale = Math.min(stageSize.width / fmt.width, stageSize.height / fmt.height, 1);
        return Math.max(0.05, scale);
      });

      // -----------------------------------------------------------------------
      // Rendering
      // -----------------------------------------------------------------------
      let previewStage = null;
      let exportStage = null;

      const renderState = (format) => ({
        format,
        colors: clone(resolvedColors.value),
        company: clone(company),
        product: clone(activeProduct.value || {}),
        content: clone(content),
        assign: clone(resolvedAssign.value),
        typography: clone(resolvedTypography.value)
      });

      // The render path is asynchronous (template, fonts, images). The token makes
      // sure only the result of the most recent call counts.
      let previewToken = 0;
      const updatePreview = async () => {
        if (!previewStage || !activeTemplate.value) return;
        const token = ++previewToken;
        try {
          await previewStage.load(activeTemplate.value.file);
          if (token !== previewToken) return;
          await previewStage.apply(renderState(currentFormat.value));
          if (token !== previewToken) return;
          templateError.value = '';
        } catch (err) {
          if (token === previewToken) templateError.value = err.message;
        } finally {
          if (token === previewToken) isPreviewLoading.value = false;
        }
      };

      let previewTimer = null;
      const schedulePreview = () => {
        if (previewTimer) clearTimeout(previewTimer);
        previewTimer = setTimeout(updatePreview, 40);
      };

      // Everything the manifest lists, kept so a removed template can come back
      // without reading the files again. A ref rather than a plain array: the
      // catalogue arrives after the first render, and removedTemplates below has
      // to notice that - otherwise the restore row never appears on a reload.
      const fullCatalog = ref([]);

      const applyHidden = () => {
        const visible = fullCatalog.value.filter(tpl => !hiddenTemplates.includes(tpl.id));
        // Never leave the catalogue empty: without a template there is nothing to
        // render and the preview would have no way back.
        templates.splice(0, templates.length, ...(visible.length ? visible : fullCatalog.value));
        normalizeSelection();
      };

      const refreshCatalog = async () => {
        const files = await loadTemplateFiles(TEMPLATE_FILES);
        fullCatalog.value = await loadTemplateCatalog(files);
        applyHidden();
      };

      const removedTemplates = computed(() =>
        fullCatalog.value.filter(tpl => hiddenTemplates.includes(tpl.id)));

      const canRemoveTemplate = computed(() => templates.length > 1);

      const removeTemplate = (id) => {
        if (!canRemoveTemplate.value) {
          showToast(t('msg.templateLast'), { tone: 'warn' });
          return;
        }
        if (hiddenTemplates.includes(id)) return;
        const name = (fullCatalog.value.find(tpl => tpl.id === id) || {}).name || id;
        hiddenTemplates.push(id);
        applyHidden();
        showToast(t('msg.templateRemoved', { name }));
      };

      const restoreTemplates = () => {
        if (!hiddenTemplates.length) return;
        const count = hiddenTemplates.length;
        hiddenTemplates.splice(0, hiddenTemplates.length);
        applyHidden();
        showToast(count === 1 ? t('msg.templatesRestoredOne') : t('msg.templatesRestored', { count }));
      };

      // -----------------------------------------------------------------------
      // Area: products
      // -----------------------------------------------------------------------
      const createNewProduct = () => {
        const newId = 'prod-' + Date.now();
        products.push({ id: newId, title: 'New product', slogan: 'Short product slogan', logo: DEFAULT_PRODUCT_LOGO });
        selection.productId = newId;
        showToast(t('msg.productCreated'));
      };

      const duplicateProduct = () => {
        const src = activeProduct.value;
        if (!src) return;
        const copy = clone(src);
        copy.id = 'prod-' + Date.now();
        copy.title = `${src.title} (copy)`;
        products.push(copy);
        selection.productId = copy.id;
        showToast(t('msg.productDuplicated'));
      };

      const deleteProduct = (id) => {
        if (isDefault(id)) return;
        const idx = products.findIndex(p => p.id === id);
        if (idx === -1) return;
        products.splice(idx, 1);
        if (selection.productId === id) selection.productId = products[0].id;
        showToast(t('msg.productDeleted'));
      };

      const readFileAsDataUrl = (e, apply) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => apply(ev.target?.result);
        reader.readAsDataURL(file);
        e.target.value = '';
      };

      /**
       * Sanitizes uploaded SVG markup: strips scripts, event handlers, and foreign objects.
       */
      const sanitizeSvg = (svgText) => {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgText, 'image/svg+xml');
          if (doc.querySelector('parsererror')) return null;
          const dangerousTags = ['script', 'foreignObject', 'iframe', 'embed', 'object', 'use'];
          for (const tag of dangerousTags) {
            doc.querySelectorAll(tag).forEach(el => el.remove());
          }
          for (const el of doc.querySelectorAll('*')) {
            for (const attr of [...el.attributes]) {
              const name = attr.name.toLowerCase();
              const val = attr.value.trim().toLowerCase();
              if (name.startsWith('on') || val.startsWith('javascript:') || val.startsWith('data:text/html')) {
                el.removeAttribute(attr.name);
              }
            }
          }
          const serialized = new XMLSerializer().serializeToString(doc.documentElement);
          return `data:image/svg+xml;utf8,${encodeURIComponent(serialized)}`;
        } catch (e) {
          return null;
        }
      };

      /**
       * Handles logo uploads: downscales large raster images to max 512x512
       * (protecting localStorage quota) and sanitizes SVGs against XSS.
       */
      const processLogoUpload = (e, apply) => {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = '';

        // SVG handling
        if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const clean = sanitizeSvg(ev.target?.result);
            if (clean) {
              apply(clean);
            } else {
              showToast(t('msg.svgRejected'), { tone: 'error' });
            }
          };
          reader.readAsText(file);
          return;
        }

        // Raster image handling (PNG, JPEG, WebP): downscale to max 512x512
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result;
          const img = new Image();
          img.onload = () => {
            const maxDim = 512;
            let w = img.naturalWidth || img.width;
            let h = img.naturalHeight || img.height;
            if (w <= maxDim && h <= maxDim) {
              apply(dataUrl);
              return;
            }
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            apply(canvas.toDataURL('image/png'));
          };
          img.onerror = () => apply(dataUrl);
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      };

      const handleProductLogoUpload = (e) =>
        processLogoUpload(e, (url) => { if (activeProduct.value) activeProduct.value.logo = url; });

      const handleCompanyLogoUpload = (e) =>
        processLogoUpload(e, (url) => { company.logo = url; });

      // -----------------------------------------------------------------------
      // Area: colour sets
      // -----------------------------------------------------------------------
      const createColorSet = () => {
        const src = editingColorSet.value || DEFAULT_COLORSETS[0];
        const newId = 'set-' + Date.now();
        colorSets.push({
          id: newId,
          name: `${src.name} (copy)`,
          colors: clone(src.colors),
          assign: clone(src.assign || DEFAULT_ASSIGN)
        });
        editingColorSetId.value = newId;
        selection.colorSetId = newId;
        showToast(t('msg.colorSetDuplicated'));
      };

      const deleteColorSet = (id) => {
        if (isDefault(id)) return;
        const idx = colorSets.findIndex(c => c.id === id);
        if (idx === -1) return;
        colorSets.splice(idx, 1);
        if (selection.colorSetId === id) selection.colorSetId = colorSets[0].id;
        if (editingColorSetId.value === id) editingColorSetId.value = colorSets[0].id;
        showToast(t('msg.colorSetDeleted'));
      };

      const resetColorSet = () => {
        const set = editingColorSet.value;
        if (!set) return;
        const def = DEFAULT_COLORSETS.find(c => c.id === set.id);
        if (!def) {
          showToast(t('msg.colorSetNoFactory'), { tone: 'warn' });
          return;
        }
        set.colors = clone(def.colors);
        set.assign = clone(def.assign || DEFAULT_ASSIGN);
        showToast(t('msg.setReset', { name: set.name }));
      };

      const applyColorSetToSelection = () => {
        selection.colorSetId = editingColorSetId.value;
        showToast(t('msg.colorSetActivated'));
      };

      // -----------------------------------------------------------------------
      // Area: font sets
      // -----------------------------------------------------------------------
      const createFontSet = () => {
        const src = editingFontSet.value || DEFAULT_FONTSETS[0];
        const newId = 'fontset-' + Date.now();
        fontSets.push({ id: newId, name: `${src.name} (copy)`, variations: clone(src.variations) });
        editingFontSetId.value = newId;
        selection.fontSetId = newId;
        showToast(t('msg.fontSetDuplicated'));
      };

      const deleteFontSet = (id) => {
        if (isDefault(id)) return;
        const idx = fontSets.findIndex(f => f.id === id);
        if (idx === -1) return;
        fontSets.splice(idx, 1);
        if (selection.fontSetId === id) selection.fontSetId = fontSets[0].id;
        if (editingFontSetId.value === id) editingFontSetId.value = fontSets[0].id;
        normalizeTypography();
        showToast(t('msg.fontSetDeleted'));
      };

      const resetFontSet = () => {
        const set = editingFontSet.value;
        if (!set) return;
        const def = DEFAULT_FONTSETS.find(f => f.id === set.id);
        if (!def) {
          showToast(t('msg.fontSetNoFactory'), { tone: 'warn' });
          return;
        }
        set.variations = clone(def.variations);
        normalizeFontSets();
        normalizeTypography();
        showToast(`"${set.name}" reset to its default.`);
      };

      const applyFontSetToSelection = () => {
        selection.fontSetId = editingFontSetId.value;
        showToast(t('msg.fontSetActivated'));
      };

      const addVariation = () => {
        const set = editingFontSet.value;
        if (!set) return;
        set.variations.push({
          id: 'var-' + Date.now(),
          name: 'New variation',
          font: DEFAULT_FONT,
          axes: {}
        });
        normalizeFontSets();
      };

      const deleteVariation = (id) => {
        if (isDefault(id)) return;
        const set = editingFontSet.value;
        if (!set) return;
        const idx = set.variations.findIndex(v => v.id === id);
        if (idx === -1) return;
        set.variations.splice(idx, 1);
        normalizeTypography();
      };

      // Swapping the family invalidates the axes of the previous one: they are
      // named per font, so "CASL" means nothing outside Recursive.
      const setVariationFont = (variation, fontId) => {
        variation.font = fontId;
        variation.axes = {};
        for (const axis of fontAxes(fontId)) variation.axes[axis.tag] = axis.default;
        normalizeTypography();
      };

      // -----------------------------------------------------------------------
      // Preview background (UI only, never part of the export)
      // -----------------------------------------------------------------------
      const BG_ZOOM_MAX = 6;
      const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));

      /**
       * The stored framing for one template and format, without creating it.
       * Reads go through here - including the export, which walks every format
       * in turn and must read the row of the format it is rendering rather than
       * the one the preview happens to be showing.
       */
      const framingFor = (templateId, formatId) =>
        (bgFraming[templateId] || {})[formatId] || DEFAULT_FRAMING;

      /** What the preview shows. */
      const framing = computed(() =>
        framingFor(selection.templateId, currentFormat.value.id));

      /**
       * The same row, ready to be written to. Creating it on the first drag
       * rather than up front keeps the stored map to the combinations that were
       * actually framed, instead of a row per template times format.
       */
      const editFraming = () => {
        const perTemplate = bgFraming[selection.templateId] || (bgFraming[selection.templateId] = {});
        const id = currentFormat.value.id;
        return perTemplate[id] || (perTemplate[id] = { ...DEFAULT_FRAMING });
      };

      /** A different picture makes every framing meaningless. */
      const resetAllFraming = () => {
        for (const key of Object.keys(bgFraming)) delete bgFraming[key];
      };

      /**
       * Size of the background image in the preview and the room it has to be moved.
       * Zoom 1 fills the frame (like object-fit: cover); the overhang of the
       * longer side is exactly the distance the image can slide.
       * That room is a fraction rather than a pixel value - image size and frame
       * both scale with previewScale, so the fraction survives any rescaling.
       */
      const bgBounds = computed(() => {
        if (!bgNatural.width || !bgNatural.height) return null;
        const fmt = currentFormat.value;
        const boxW = fmt.width * previewScale.value;
        const boxH = fmt.height * previewScale.value;
        const cover = Math.max(boxW / bgNatural.width, boxH / bgNatural.height);
        const width = bgNatural.width * cover * framing.value.zoom;
        const height = bgNatural.height * cover * framing.value.zoom;
        return {
          boxW, boxH, width, height,
          maxX: Math.max(0, (width - boxW) / 2) / boxW,
          maxY: Math.max(0, (height - boxH) / 2) / boxH
        };
      });

      // What the markup uses: pixel values for the current preview. Clamping also
      // happens here, so a row saved under a wider zoom is read back inside the
      // room the current one leaves, without being written down narrower.
      const bgView = computed(() => {
        const b = bgBounds.value;
        if (!b) return null;
        const view = framing.value;
        return {
          width: b.width,
          height: b.height,
          x: clamp(view.x, -b.maxX, b.maxX) * b.boxW,
          y: clamp(view.y, -b.maxY, b.maxY) * b.boxH
        };
      });

      // Reads before it writes: this also runs when a picture finishes loading,
      // and a combination nobody has framed should not gain a row of defaults
      // just for having been looked at.
      const clampBgOffset = () => {
        const b = bgBounds.value;
        if (!b) return;
        const view = framing.value;
        const x = clamp(view.x, -b.maxX, b.maxX);
        const y = clamp(view.y, -b.maxY, b.maxY);
        if (x === view.x && y === view.y) return;
        const row = editFraming();
        row.x = x;
        row.y = y;
      };

      /** Back to the default framing for this template and format only. */
      const resetBgView = () => {
        const perTemplate = bgFraming[selection.templateId];
        if (perTemplate) delete perTemplate[currentFormat.value.id];
      };

      const hasCustomBg = () => bgMode.value === 'custom' && !!customBgUrl.value;

      const onBgLoad = (e) => {
        bgNatural.width = e.target.naturalWidth;
        bgNatural.height = e.target.naturalHeight;
        clampBgOffset();
      };

      // Zooms around the pointer: the point underneath it stays put.
      const onBgWheel = (e) => {
        if (!hasCustomBg() || !bgBounds.value) return;
        e.preventDefault();
        const view = editFraming();
        const next = clamp(view.zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12), 1, BG_ZOOM_MAX);
        const factor = next / view.zoom;
        if (factor === 1) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        view.x = cx - (cx - view.x) * factor;
        view.y = cy - (cy - view.y) * factor;
        view.zoom = next;
        clampBgOffset();
      };

      let bgDrag = null;
      const onBgPointerDown = (e) => {
        if (!hasCustomBg()) return;
        const rect = e.currentTarget.getBoundingClientRect();
        bgDrag = { x: e.clientX, y: e.clientY, width: rect.width, height: rect.height };
        isBgDragging.value = true;
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      };

      const onBgPointerMove = (e) => {
        if (!bgDrag) return;
        const view = editFraming();
        view.x += (e.clientX - bgDrag.x) / bgDrag.width;
        view.y += (e.clientY - bgDrag.y) / bgDrag.height;
        bgDrag.x = e.clientX;
        bgDrag.y = e.clientY;
        clampBgOffset();
      };

      const onBgPointerUp = (e) => {
        if (!bgDrag) return;
        bgDrag = null;
        isBgDragging.value = false;
        try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      };

      /**
       * Only ever a picture. The value ends up as the src of an image and is
       * drawn into a canvas, and a setup is a file that can come from anywhere.
       */
      const isImageDataUrl = (value) =>
        typeof value === 'string' && /^data:image\/[a-z0-9.+-]+[;,]/i.test(value);

      /**
       * Takes on a picture. A different one makes every framing meaningless, so
       * they all go - unless an imported setup is waiting for exactly this file,
       * in which case its framing is the reason the file was asked for.
       */
      const useBackground = (url, name, { keepFraming = false } = {}) => {
        if (!isImageDataUrl(url)) {
          showToast(t('msg.bgNotAnImage'), { tone: 'error' });
          return false;
        }
        // The preview needs the natural size of the picture to place it, and
        // that used to arrive only with the load event of the preview image.
        // Setting the same picture again does not change the src and so fires
        // no such event - while the size had already been cleared, which left
        // the background in place but invisible. It is measured here instead,
        // and the size is only dropped when the picture really is another one.
        if (customBgUrl.value !== url) {
          bgNatural.width = 0;
          bgNatural.height = 0;
        }
        customBgUrl.value = url;
        bgName.value = name || '';
        bgMode.value = 'custom';
        if (!keepFraming) resetAllFraming();
        measureBackground(url);
        BKG_STORE.put(BKG_STORE.BACKGROUND, { dataUrl: url, name: bgName.value });
        return true;
      };

      /**
       * Reads the natural size of a picture without going through the preview.
       * A later picture wins: the check on the way out drops the answer to a
       * measurement that has since been overtaken.
       */
      const measureBackground = (url) => {
        loadImageFrom(url).then((img) => {
          if (customBgUrl.value !== url) return;
          bgNatural.width = img.naturalWidth;
          bgNatural.height = img.naturalHeight;
          clampBgOffset();
        }).catch(() => { /* the toast for an unreadable picture is enough */ });
      };

      // File names are compared the way a file system does it, so the same
      // picture coming back as HOLIDAY.PNG is still the same picture.
      const sameFile = (one, other) =>
        one.trim().toLowerCase() === other.trim().toLowerCase();

      // A different picture is being picked while a setup is still waiting for
      // the one it named. Its framing was measured against that picture and
      // would go, so it is asked about rather than done.
      const pendingBgSwap = ref(null);

      const handleBgUpload = (e) => {
        const file = e.target.files?.[0];
        const expected = awaitedBgName.value;
        const name = file ? file.name : '';
        readFileAsDataUrl(e, (url) => {
          if (expected && !sameFile(expected, name) && isImageDataUrl(url)) {
            pendingBgSwap.value = { expected, picked: name, url };
            return;
          }
          if (!useBackground(url, name, { keepFraming: !!expected })) return;
          awaitedBgName.value = '';
        });
      };

      const confirmBgSwap = () => {
        const job = pendingBgSwap.value;
        if (!job) return;
        pendingBgSwap.value = null;
        // Not keeping the framing is the whole point of the question.
        if (useBackground(job.url, job.picked)) awaitedBgName.value = '';
      };

      const cancelBgSwap = () => { pendingBgSwap.value = null; };

      /**
       * Puts the background back to none.
       *
       * `forget` says whether the picture is dropped from the asset store as
       * well. Taking it off the screen and throwing it away are the same thing
       * everywhere but one place: at startup the stored setup names a picture
       * it does not carry, and the store is where that picture is waiting.
       */
      const clearBackground = ({ forget }) => {
        customBgUrl.value = null;
        bgName.value = '';
        awaitedBgName.value = '';
        bgMode.value = 'checkerboard-dark';
        bgNatural.width = 0;
        bgNatural.height = 0;
        resetAllFraming();
        if (forget) BKG_STORE.remove(BKG_STORE.BACKGROUND);
      };

      const removeCustomBg = () => clearBackground({ forget: true });

      // -----------------------------------------------------------------------
      // Export
      // -----------------------------------------------------------------------
      const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };

      const slug = (str, fallback = 'overlay') => String(str || fallback).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || fallback;

      /** The background inside a ZIP, named after what the data URL says it is. */
      const backgroundFilename = () => {
        const type = /^data:image\/([a-z0-9.+-]+)/i.exec(customBgUrl.value || '');
        const ext = (type ? type[1] : 'png').replace('jpeg', 'jpg').replace('svg+xml', 'svg');
        return `background.${ext}`;
      };

      const buildFilename = (fmt) =>
        `${slug(activeProduct.value.title)}_${slug(activeTemplate.value.id)}_${slug(activeColorSet.value.name)}_${fmt.id.replace(':', 'x')}.png`;

      /**
       * A background image is part of the picture, not a preview aid: when one is
       * set it is drawn underneath the overlay at full export resolution, so the
       * file is ready to upload as it stands. Without one the export stays a
       * transparent overlay.
       *
       * The framing maths is the one from bgBounds. The offsets are fractions of
       * the frame rather than pixel values, so they carry from the scaled preview
       * to the full-size export untouched - the stage shows what the file holds.
       */
      const loadImageFrom = (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('The background image could not be read.'));
        img.src = src;
      });

      const composeOverBackground = async (overlayBlob, fmt) => {
        if (bgMode.value !== 'custom' || !customBgUrl.value) return overlayBlob;

        const overlayUrl = URL.createObjectURL(overlayBlob);
        try {
          const [bg, overlay] = await Promise.all([
            loadImageFrom(customBgUrl.value),
            loadImageFrom(overlayUrl)
          ]);

          // The framing of the format being rendered, not of the one on screen:
          // a ZIP walks all four in turn while the preview stays where it is.
          const view = framingFor(activeTemplate.value.id, fmt.id);
          const cover = Math.max(fmt.width / bg.naturalWidth, fmt.height / bg.naturalHeight);
          const width = bg.naturalWidth * cover * view.zoom;
          const height = bg.naturalHeight * cover * view.zoom;
          const maxX = Math.max(0, (width - fmt.width) / 2) / fmt.width;
          const maxY = Math.max(0, (height - fmt.height) / 2) / fmt.height;

          const canvas = document.createElement('canvas');
          canvas.width = fmt.width;
          canvas.height = fmt.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(
            bg,
            (fmt.width - width) / 2 + clamp(view.x, -maxX, maxX) * fmt.width,
            (fmt.height - height) / 2 + clamp(view.y, -maxY, maxY) * fmt.height,
            width,
            height
          );
          ctx.drawImage(overlay, 0, 0, fmt.width, fmt.height);

          return await new Promise((resolve, reject) => canvas.toBlob(
            (blob) => blob ? resolve(blob) : reject(new Error('The composed PNG could not be produced.')),
            'image/png'
          ));
        } finally {
          URL.revokeObjectURL(overlayUrl);
        }
      };

      const renderFormat = async (fmt) => {
        await exportStage.load(activeTemplate.value.file);
        await exportStage.apply(renderState(fmt));
        const blob = await exportStage.exportBlob(fmt);
        if (!blob) throw new Error('The PNG could not be produced.');
        // The blob comes from the iframe (a different JS context). JSZip checks with
        // instanceof Blob and would reject it, hence the copy into an app blob.
        const overlay = new Blob([await blob.arrayBuffer()], { type: 'image/png' });
        return composeOverBackground(overlay, fmt);
      };

      const exportSinglePNG = async () => {
        if (isExporting.value) return;
        isExporting.value = true;
        exportStatusText.value = t('ex.statusPng');
        try {
          const fmt = currentFormat.value;
          const blob = await renderFormat(fmt);
          const filename = buildFilename(fmt);
          downloadBlob(blob, filename);
          showToast(t('msg.pngExported', { name: filename }));
        } catch (err) {
          console.error(err);
          showToast(t('msg.pngFailed', { error: err.message }), { tone: 'error', duration: 5000 });
        } finally {
          isExporting.value = false;
          exportStatusText.value = '';
        }
      };

      /**
       * The background as a setup carries it.
       *
       * The framing is a handful of numbers and always travels. The picture is
       * megabytes and only travels when asked for: into an exported file when
       * the save dialog says so, and never into localStorage, which is written
       * as one string and would lose the entire setup rather than just the
       * image (the picture itself lives in the asset store, see store.js).
       *
       * Without the picture the name is what is left. An import can then say
       * which file the setup expects instead of silently coming up blank.
       */
      const backgroundSnapshot = ({ withImage }) => {
        if (!hasCustomBg()) return null;
        return {
          name: bgName.value,
          framing: clone(bgFraming),
          image: withImage ? customBgUrl.value : undefined
        };
      };

      const buildSetupSnapshot = ({ withImage = false } = {}) => ({
        id: CONFIG_ID,
        version: CONFIG_VERSION,
        exportedAt: new Date().toISOString(),
        company: clone(company),
        products: clone(products),
        colorSets: clone(colorSets),
        fontSets: clone(fontSets),
        typography: clone(typography),
        content: clone(content),
        selection: clone(selection),
        hiddenTemplates: clone(hiddenTemplates),
        background: backgroundSnapshot({ withImage })
      });

      const exportZipPackage = async () => {
        if (isExporting.value) return;
        const targetFmts = SOCIAL_FORMATS.filter(f => selectedFormats.value.includes(f.id));
        if (!targetFmts.length) {
          showToast(t('msg.pickFormat'), { tone: 'warn' });
          return;
        }

        isExporting.value = true;
        exportProgressPercent.value = 0;
        const total = targetFmts.length;
        try {
          const zip = new JSZip();
          const folderName = `${slug(activeProduct.value.title)}_overlays`;
          const folder = zip.folder(folderName);

          let count = 0;
          for (const fmt of targetFmts) {
            exportStatusText.value = t('ex.statusFormat', { format: fmt.id, index: count + 1, total });
            exportProgressPercent.value = Math.round((count / (total + 1)) * 100);
            folder.file(buildFilename(fmt), await renderFormat(fmt));
            count++;
          }
          folder.file('brand-setup.json', JSON.stringify(buildSetupSnapshot(), null, 2));
          // The picture goes in as a file rather than as base64 inside the
          // setup: a third smaller, and it can be looked at. The setup names it.
          if (hasCustomBg()) {
            const source = await fetch(customBgUrl.value);
            folder.file(backgroundFilename(), await source.blob());
          }

          exportStatusText.value = t('ex.statusZip');
          exportProgressPercent.value = Math.round((total / (total + 1)) * 100);
          const zipBlob = await zip.generateAsync({ type: 'blob' });
          exportProgressPercent.value = 100;
          const zipFilename = `${folderName}.zip`;
          downloadBlob(zipBlob, zipFilename);
          showToast(t('msg.zipCreated', { name: zipFilename }));
        } catch (err) {
          console.error(err);
          showToast(t('msg.zipFailed', { error: err.message }), { tone: 'error', duration: 5000 });
        } finally {
          isExporting.value = false;
          exportStatusText.value = '';
          exportProgressPercent.value = 0;
        }
      };

      // -----------------------------------------------------------------------
      // Saving and loading a setup
      // -----------------------------------------------------------------------
      const writeSetupFile = (withImage) => {
        const blob = new Blob([JSON.stringify(buildSetupSnapshot({ withImage }), null, 2)],
          { type: 'application/json' });
        const filename = `${slug(company.name, 'brand')}_brandkit_config.json`;
        downloadBlob(blob, filename);
        showToast(t(withImage ? 'msg.configSavedWithImage' : 'msg.configSaved'));
      };

      // Asked only when there is a background to decide about: with the picture
      // the file is complete but runs to megabytes, without it stays small and
      // names the file it expects instead. Everything else about a setup is text.
      const pendingSave = ref(null);

      const exportConfigJson = () => {
        if (!hasCustomBg()) {
          writeSetupFile(false);
          return;
        }
        pendingSave.value = { name: bgName.value };
      };

      const confirmSave = (withImage) => {
        pendingSave.value = null;
        writeSetupFile(withImage);
      };

      const cancelSave = () => { pendingSave.value = null; };

      /**
       * Takes the framing rows out of a setup, one number at a time.
       *
       * A row is three numbers under a template and a format, and a file can
       * come from anywhere, so nothing is copied across on trust. Rows for a
       * format this build does not have are dropped; rows for a template it
       * does not have are kept, because the catalogue is read from disk after
       * the setup and a template that is merely switched off should find its
       * framing again when it comes back.
       */
      const applyFraming = (rows) => {
        resetAllFraming();
        if (!rows || typeof rows !== 'object') return;
        const formats = new Set(SOCIAL_FORMATS.map(f => f.id));
        for (const [templateId, perTemplate] of Object.entries(rows)) {
          if (!templateId || !perTemplate || typeof perTemplate !== 'object') continue;
          for (const [formatId, row] of Object.entries(perTemplate)) {
            if (!formats.has(formatId) || !row || typeof row !== 'object') continue;
            const x = Number(row.x);
            const y = Number(row.y);
            const zoom = Number(row.zoom);
            if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(zoom)) continue;
            const target = bgFraming[templateId] || (bgFraming[templateId] = {});
            target[formatId] = {
              x: clamp(x, -1, 1),
              y: clamp(y, -1, 1),
              zoom: clamp(zoom, 1, BG_ZOOM_MAX)
            };
          }
        }
      };

      /**
       * The background of an imported setup. With the picture it is simply set;
       * with only a name the framing is kept and the name is what the app asks
       * for, because a browser cannot reopen a file by its path.
       */
      const applyBackground = (payload, { fromStorage }) => {
        if (!payload || typeof payload !== 'object') {
          clearBackground({ forget: !fromStorage });
          return;
        }
        const name = typeof payload.name === 'string' ? payload.name : '';
        if (isImageDataUrl(payload.image)) {
          useBackground(payload.image, name, { keepFraming: true });
          applyFraming(payload.framing);
          awaitedBgName.value = '';
          return;
        }
        clearBackground({ forget: !fromStorage });
        applyFraming(payload.framing);
        awaitedBgName.value = name;
      };

      // Reads a setup field by field rather than taking the object as it comes, so
      // a damaged or hand-edited file cannot put anything unexpected into the
      // state. The normalisers afterwards repair what is missing or dangling.
      // Callers check with identifySetup first.
      const applySetup = (payload, { fromStorage = false } = {}) => {
        if (!payload || typeof payload !== 'object') return false;

        if (payload.company) {
          const { name, slogan, copyright, font, logo } = payload.company;
          if (typeof name === 'string') company.name = name;
          if (typeof slogan === 'string') company.slogan = slogan;
          if (typeof copyright === 'string') company.copyright = copyright;
          if (typeof logo === 'string') company.logo = logo;
          if (FONT_IDS.has(font)) company.font = font;
        }
        if (Array.isArray(payload.products) && payload.products.length) {
          products.splice(0, products.length, ...payload.products.map(p => ({
            id: p.id, title: p.title, slogan: p.slogan, logo: p.logo
          })));
        }
        if (Array.isArray(payload.colorSets) && payload.colorSets.length) {
          colorSets.splice(0, colorSets.length, ...payload.colorSets);
        }
        if (Array.isArray(payload.fontSets) && payload.fontSets.length) {
          fontSets.splice(0, fontSets.length, ...payload.fontSets);
        }
        // A setup that brings a typography mapping replaces it whole: a placeholder
        // the file does not mention goes back to its default row rather than
        // keeping whatever happened to be there. A setup without the key at all
        // leaves the mapping alone instead of silently clearing it.
        if (payload.typography && typeof payload.typography === 'object') {
          for (const slot of TEXT_SLOTS) {
            const row = payload.typography[slot.key];
            typography[slot.key] = (row && typeof row === 'object')
              ? { variation: row.variation, weight: Number(row.weight) }
              : clone(TYPO_DEFAULTS[slot.key] || { variation: DEFAULT_ID, weight: 400 });
          }
        }
        if (payload.content) {
          for (const key of Object.keys(DEFAULT_CONTENT)) {
            const value = payload.content[key];
            // What the setup does not carry is empty - otherwise a text field from
            // the previous state would stay put (tag2 from version 6.0, say).
            content[key] = typeof value === 'string' ? value : '';
          }
        }
        if (Array.isArray(payload.hiddenTemplates)) {
          hiddenTemplates.splice(0, hiddenTemplates.length,
            ...payload.hiddenTemplates.filter(id => typeof id === 'string' && id));
        }
        // Only the four keys the selection actually has. A wholesale assign would
        // carry anything else in the file into the state and from there into
        // every later export and into localStorage.
        if (payload.selection && typeof payload.selection === 'object') {
          for (const key of SELECTION_KEYS) {
            const value = payload.selection[key];
            if (typeof value === 'string' && value) selection[key] = value;
          }
        }
        // An import replaces the whole setup, so a file that brings no
        // background clears the one that is there rather than leaving it under
        // someone else's design. A file from before 1.2.0 knows nothing about
        // backgrounds and says so by having no key at all - that one is left alone.
        if (payload.background !== undefined) applyBackground(payload.background, { fromStorage });

        normalizeProducts();
        normalizeColorSets();
        normalizeFontSets();
        normalizeSelection();
        normalizeTypography();
        editingColorSetId.value = selection.colorSetId;
        editingFontSetId.value = selection.fontSetId;
        // The catalogue may have been filtered differently before this setup
        if (fullCatalog.value.length) applyHidden();
        return true;
      };

      /**
       * Decides whether parsed data is one of our setups, before anything of it is
       * applied. The id settles it - every setup the app writes carries one, so a
       * file without it is not ours.
       * Returns { ok, reason } or { ok, version, warning, contains }.
       */
      const identifySetup = (payload) => {
        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
          return { ok: false, reason: t('msg.notAnObject') };
        }
        if (payload.id !== CONFIG_ID) {
          return {
            ok: false,
            reason: typeof payload.id === 'string' && payload.id
              ? t('msg.foreignFile', { id: payload.id })
              : t('msg.noIdentifier')
          };
        }

        // Only the major version matters. A newer one may carry areas this build
        // knows nothing about; they are skipped rather than refused.
        const version = typeof payload.version === 'string' ? payload.version : '';
        const major = parseInt(version, 10);
        let warning = '';
        if (Number.isFinite(major) && major > CONFIG_MAJOR) {
          warning = t('msg.newerVersion', { version, current: CONFIG_VERSION });
        } else if (!version) {
          warning = t('msg.noVersion');
        }
        return {
          ok: true,
          version: version || t('import.unknownVersion'),
          warning,
          contains: SETUP_KEYS.filter(key => payload[key] != null)
        };
      };

      // An import replaces the whole setup, so it is shown first and carried out
      // only on confirmation. Set while the dialog is open.
      const pendingImport = ref(null);
      const importConfirmRef = ref(null);

      const importConfigJson = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          let payload;
          try {
            payload = JSON.parse(ev.target.result);
          } catch (err) {
            showToast(t('msg.invalidJson'), { tone: 'error' });
            return;
          }
          const check = identifySetup(payload);
          if (!check.ok) {
            showToast(check.reason, { tone: 'error', duration: 5000 });
            return;
          }
          pendingImport.value = {
            fileName: file.name,
            payload,
            version: check.version,
            warning: check.warning,
            contains: check.contains
          };
        };
        reader.readAsText(file);
        e.target.value = '';
      };

      const cancelImport = () => { pendingImport.value = null; };

      const confirmImport = () => {
        const job = pendingImport.value;
        if (!job) return;
        pendingImport.value = null;
        if (applySetup(job.payload)) {
          showToast(t('msg.setupLoaded', { name: job.fileName }));
        } else {
          showToast(t('msg.setupFailed'), { tone: 'error' });
        }
      };

      // Label for one area in the import dialog
      const setupAreaLabel = (key) => t('area.' + key);

      const resetAll = () => {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
        removeCustomBg();
        hiddenTemplates.splice(0, hiddenTemplates.length);
        Object.assign(company, clone(DEFAULT_COMPANY));
        products.splice(0, products.length, ...clone(DEFAULT_PRODUCTS));
        colorSets.splice(0, colorSets.length, ...clone(DEFAULT_COLORSETS));
        Object.assign(content, clone(DEFAULT_CONTENT));
        fontSets.splice(0, fontSets.length, ...clone(DEFAULT_FONTSETS));
        Object.assign(typography, clone(TYPO_DEFAULTS));
        Object.assign(selection, clone(DEFAULT_SELECTION));
        normalizeProducts();
        normalizeColorSets();
        normalizeFontSets();
        normalizeSelection();
        normalizeTypography();
        // hiddenTemplates was just emptied; the catalogue is still filtered by it
        // until this runs, so the removed templates would otherwise only come
        // back on the next reload.
        if (fullCatalog.value.length) applyHidden();
        editingColorSetId.value = selection.colorSetId;
        editingFontSetId.value = selection.fontSetId;
        showToast(t('msg.resetDone'));
      };

      // The fallback entry of a list: always present, always first, always under
      // its factory name. The UI blocks renaming and deleting it, and a setup
      // from elsewhere must not be able to get around that either.
      const isDefault = (id) => id === DEFAULT_ID;

      function ensureDefault(list, factory, nameKey) {
        const idx = list.findIndex(item => item.id === DEFAULT_ID);
        if (idx === -1) list.unshift(clone(factory));
        else if (idx > 0) list.unshift(list.splice(idx, 1)[0]);
        list[0][nameKey] = factory[nameKey];
      }

      function normalizeProducts() {
        ensureDefault(products, DEFAULT_PRODUCTS[0], 'title');
      }

      // Keeps every variation on a family that exists and every axis value inside
      // its declared range; a family swap drops axes the new one does not have.
      function normalizeFontSets() {
        ensureDefault(fontSets, DEFAULT_FONTSETS[0], 'name');
        for (const set of fontSets) {
          if (!Array.isArray(set.variations) || !set.variations.length) {
            set.variations = clone(DEFAULT_FONTSETS[0].variations);
          }
          // Every set keeps the fallback variation, so a placeholder mapping
          // always resolves - in a duplicated set as well.
          ensureDefault(set.variations, DEFAULT_FONTSETS[0].variations[0], 'name');
          for (const variation of set.variations) {
            if (!FONT_IDS.has(variation.font)) variation.font = DEFAULT_FONT;
            const axes = {};
            for (const axis of fontAxes(variation.font)) {
              const value = Number((variation.axes || {})[axis.tag]);
              axes[axis.tag] = Number.isFinite(value)
                ? Math.min(axis.max, Math.max(axis.min, value))
                : axis.default;
            }
            variation.axes = axes;
          }
        }
      }

      // Every text placeholder needs a row, pointing at a variation that exists
      // and carrying a weight the chosen family actually supports.
      function normalizeTypography() {
        for (const slot of TEXT_SLOTS) {
          const fallback = TYPO_DEFAULTS[slot.key] || { variation: DEFAULT_ID, weight: 400 };
          if (!typography[slot.key]) typography[slot.key] = clone(fallback);
          const row = typography[slot.key];
          const list = (activeFontSet.value || {}).variations || [];
          if (!list.some(v => v.id === row.variation)) {
            row.variation = list.some(v => v.id === fallback.variation)
              ? fallback.variation
              : (list[0] || {}).id;
          }
          const [min, max] = weightRange(variationOf(row.variation).font);
          const weight = Number(row.weight);
          row.weight = Math.min(max, Math.max(min, Number.isFinite(weight) ? weight : fallback.weight));
        }
      }

      // Older setups do not know the assignment yet, and a colour set must not
      // point at a role that does not exist (or at the background).
      function normalizeColorSets() {
        ensureDefault(colorSets, DEFAULT_COLORSETS[0], 'name');
        for (const set of colorSets) {
          const assign = {};
          for (const [key, fallback] of Object.entries(DEFAULT_ASSIGN)) {
            const role = (set.assign || {})[key];
            assign[key] = ASSIGNABLE_ROLES.some(r => r.key === role) ? role : fallback;
          }
          set.assign = assign;
        }
      }

      // Prevents an empty preview after a deletion or with a broken setup
      function normalizeSelection() {
        if (!products.some(p => p.id === selection.productId)) selection.productId = DEFAULT_ID;
        if (!templates.some(t => t.id === selection.templateId)) selection.templateId = templates[0]?.id;
        if (!colorSets.some(c => c.id === selection.colorSetId)) selection.colorSetId = DEFAULT_ID;
        if (!colorSets.some(c => c.id === editingColorSetId.value)) editingColorSetId.value = selection.colorSetId;
        if (!fontSets.some(f => f.id === selection.fontSetId)) selection.fontSetId = DEFAULT_ID;
        if (!fontSets.some(f => f.id === editingFontSetId.value)) editingFontSetId.value = selection.fontSetId;
      }

      // -----------------------------------------------------------------------
      // Persistence
      // -----------------------------------------------------------------------
      let saveTimer = null;
      const saveStorage = () => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(buildSetupSnapshot()));
        } catch (e) {
          console.warn('Storage quota exceeded or private mode:', e);
          showToast(t('msg.storageFull'), { tone: 'error' });
        }
      };

      const scheduleSave = () => {
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(saveStorage, 300);
      };

      const flushSave = () => {
        if (saveTimer) {
          clearTimeout(saveTimer);
          saveTimer = null;
        }
        saveStorage();
      };

      /**
       * Brings back the picture the stored setup expects. Asynchronous, so the
       * app is already usable when it lands; until then the background is
       * simply the one the setup names and does not have.
       */
      const restoreStoredBackground = () => {
        if (!awaitedBgName.value) return;
        BKG_STORE.get(BKG_STORE.BACKGROUND).then((saved) => {
          if (!saved || !isImageDataUrl(saved.dataUrl) || !awaitedBgName.value) return;
          useBackground(saved.dataUrl, saved.name || awaitedBgName.value, { keepFraming: true });
          awaitedBgName.value = '';
        });
      };

      // Read once at startup. What is in the slot goes through the same check as an
      // imported file: the app writes it, but it is also the one piece of state
      // that can be edited from outside the app.
      const loadStorage = () => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (!saved) return;
          const payload = JSON.parse(saved);
          if (identifySetup(payload).ok) applySetup(payload, { fromStorage: true });
          else localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          try { localStorage.removeItem(STORAGE_KEY); } catch (e2) { /* ignore */ }
        }
      };

      // -----------------------------------------------------------------------
      // Lifecycle and reactivity
      // -----------------------------------------------------------------------
      const refreshIcons = () => {
        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
      };

      let resizeObserver = null;

      const onGlobalKeydown = (e) => {
        if (e.key !== 'Escape') return;
        if (pendingImport.value) cancelImport();
        else if (pendingSave.value) cancelSave();
        else if (pendingBgSwap.value) cancelBgSwap();
      };

      onMounted(async () => {
        window.addEventListener('beforeunload', flushSave);
        window.addEventListener('keydown', onGlobalKeydown);
        document.documentElement.setAttribute('lang', lang.value);

        try {
          const saved = localStorage.getItem(THEME_KEY);
          if (THEMES.includes(saved)) theme.value = saved;
        } catch (e) { /* private mode */ }
        applyTheme();

        loadStorage();
        // The setup in localStorage carries the framing and the name of the
        // background but never the picture itself; that one is in the asset
        // store. Restoring it keeps the framing that was just read - it was
        // measured against this very picture.
        restoreStoredBackground();
        // Also run on a first start, where loadStorage finds nothing and
        // applySetup never gets to normalise the defaults.
        normalizeProducts();
        normalizeColorSets();
        normalizeFontSets();
        normalizeTypography();

        previewStage = new TemplateStage(previewFrameRef.value);
        exportStage = new TemplateStage(exportFrameRef.value, { sizeIframe: true });

        if (window.ResizeObserver && stageAreaRef.value) {
          resizeObserver = new ResizeObserver(([entry]) => {
            stageSize.width = entry.contentRect.width;
            stageSize.height = entry.contentRect.height;
          });
          resizeObserver.observe(stageAreaRef.value);
        }

        nextTick(refreshIcons);
        await refreshCatalog();
        await updatePreview();
      });

      onBeforeUnmount(() => {
        window.removeEventListener('beforeunload', flushSave);
        window.removeEventListener('keydown', onGlobalKeydown);
        if (saveTimer) clearTimeout(saveTimer);
        if (resizeObserver) resizeObserver.disconnect();
        if (toastTimer) clearTimeout(toastTimer);
        if (confirmTimer) clearTimeout(confirmTimer);
      });

      watch([company, products, colorSets, fontSets, typography, content, selection, currentFormat, hiddenTemplates,
             bgFraming, bgMode, customBgUrl, bgName], () => {
        normalizeSelection();
        scheduleSave();
        schedulePreview();
      }, { deep: true });

      watch(activeTab, () => { pendingConfirm.value = ''; nextTick(refreshIcons); });
      // A different font set may not know the variations the mapping points at
      watch(() => selection.fontSetId, () => normalizeTypography());
      watch(customBgUrl, () => nextTick(refreshIcons));
      // The save dialog and the row naming a background that is still missing
      // both bring an icon of their own, so lucide has to run once they exist
      watch(pendingSave, () => nextTick(refreshIcons));
      watch(pendingBgSwap, () => nextTick(refreshIcons));
      watch(awaitedBgName, () => nextTick(refreshIcons));
      // The restore row appears and disappears with its own icon in it
      watch(() => removedTemplates.value.length, () => nextTick(refreshIcons));
      // The armed state swaps an icon for a label and back, so lucide has to run again
      watch(pendingConfirm, () => nextTick(refreshIcons));
      // The import dialog brings its own icons in, and the confirming button takes
      // the focus so that Escape and Enter work without reaching for the mouse
      watch(pendingImport, (job) => nextTick(() => {
        refreshIcons();
        if (job && importConfirmRef.value) importConfirmRef.value.focus();
      }));

      return {
        // State
        company,
        products,
        colorSets,
        fontSets,
        typography,
        templates,
        removedTemplates,
        canRemoveTemplate,
        removeTemplate,
        restoreTemplates,
        content,
        selection,
        currentFormat,
        editingColorSetId,
        editingFontSetId,
        stageAreaRef,
        previewFrameRef,
        exportFrameRef,
        templateError,
        isPreviewLoading,
        bgMode,
        customBgUrl,
        bgName,
        framing,
        awaitedBgName,
        bgFraming,
        editFraming,
        useBackground,
        flushSave,
        isBgDragging,
        activeTab,
        isExporting,
        exportStatusText,
        exportProgressPercent,
        toast,
        toastStyle,
        footerLinks,
        appVersion,
        lang,
        t,
        setLang,
        toggleLang,
        nextLangLabel,
        roleHint,
        assignLabel,
        slotLabel,
        slotSource,
        formatName,
        menuGroupLabel,
        menuItemLabel,
        axisLabel,
        axisHint,
        fontNote,
        theme,
        pendingConfirm,
        selectedFormats,
        // Computed
        activeProduct,
        activeTemplate,
        activeColorSet,
        editingColorSet,
        activeFontSet,
        editingFontSet,
        resolvedColors,
        resolvedAssign,
        resolvedTypography,
        typoRows,
        bgView,
        previewScale,
        // Constants
        MENU_GROUPS,
        SOCIAL_FORMATS,
        FONTS,
        COLOR_ROLES,
        COLOR_ASSIGNMENTS,
        ASSIGNABLE_ROLES,
        SLOTS,
        // Actions
        usesSlot,
        toggleTheme,
        isDefault,
        askConfirm,
        roleLabel,
        fontAxes,
        normalizeTypography,
        createNewProduct,
        duplicateProduct,
        deleteProduct,
        handleProductLogoUpload,
        handleCompanyLogoUpload,
        createColorSet,
        deleteColorSet,
        resetColorSet,
        applyColorSetToSelection,
        createFontSet,
        deleteFontSet,
        resetFontSet,
        applyFontSetToSelection,
        addVariation,
        deleteVariation,
        setVariationFont,
        handleBgUpload,
        pendingBgSwap,
        confirmBgSwap,
        cancelBgSwap,
        removeCustomBg,
        onBgLoad,
        onBgWheel,
        onBgPointerDown,
        onBgPointerMove,
        onBgPointerUp,
        resetBgView,
        exportSinglePNG,
        exportZipPackage,
        exportConfigJson,
        pendingSave,
        confirmSave,
        cancelSave,
        importConfigJson,
        pendingImport,
        importConfirmRef,
        confirmImport,
        cancelImport,
        setupAreaLabel,
        resetAll
      };
    }
  });

  /**
   * Pulls the sidebar panels in from panels/*.html before Vue sees the markup.
   * Each <div data-panel="name"> in index.html is replaced by the contents of
   * panels/name.html, so the panels are separate files to edit while staying one
   * component with one setup() scope - no props to thread through, no behaviour
   * change. It has to finish before mount(), because Vue compiles the in-DOM
   * template once and never looks at the markup again.
   *
   * A panel that cannot be loaded leaves a visible note in its place rather than
   * an empty tab, and the rest of the app still starts.
   */
  async function inlinePanels() {
    const holders = [...document.querySelectorAll('#app [data-panel]')];
    await Promise.all(holders.map(async (holder) => {
      const name = holder.dataset.panel;
      try {
        const res = await fetch(`panels/${name}.html`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        holder.outerHTML = await res.text();
      } catch (err) {
        console.error(`[panels] panels/${name}.html could not be loaded:`, err);
        holder.outerHTML =
          `<div v-show="activeTab === '${name}'" class="p-4 rounded-lg bg-danger-500/10 `
          + `border border-danger-500/40 text-danger-300 text-xs">`
          + `This area could not be loaded (panels/${name}.html).</div>`;
      }
    }));
  }

  inlinePanels().then(() => app.mount('#app'));
})();
