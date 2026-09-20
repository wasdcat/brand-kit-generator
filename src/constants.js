/**
 * WASDCAT Brand Kit Generator - Constants & Presets
 *
 * Data model:
 *   COMPANY   -> name, slogan, copyright, font, logo
 *   PRODUCTS  -> title, slogan, font, logo
 *   COLORSETS -> 7 colour roles (--color-<role> in the template) plus the
 *                assignment stating which role a design object uses
 *                (--<object>-color)
 *   TEMPLATES -> HTML files under templates/. The design lives entirely in the
 *                CSS of the file.
 * Creation picks a product, a template and a colour set and supplies the text.
 *
 * The available typefaces have their own catalogue in fonts.js.
 */
(function () {
  // ---------------------------------------------------------------------------
  // Default logos (inline SVG data URIs)
  // ---------------------------------------------------------------------------
  const DEFAULT_COMPANY_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="%236366f1" />
        <stop offset="100%" stop-color="%2306b6d4" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="88" height="88" rx="24" fill="url(%23g1)" />
    <path d="M28 32 L38 46 L24 50 Z" fill="%23ffffff" opacity="0.9" />
    <path d="M72 32 L62 46 L76 50 Z" fill="%23ffffff" opacity="0.9" />
    <circle cx="50" cy="56" r="22" fill="%230f172a" />
    <rect x="46" y="44" width="8" height="24" rx="2" fill="%2338bdf8" />
    <rect x="38" y="52" width="24" height="8" rx="2" fill="%2338bdf8" />
    <circle cx="36" cy="40" r="3.5" fill="%23ffffff" />
    <circle cx="64" cy="40" r="3.5" fill="%23ffffff" />
    <circle cx="50" cy="35" r="4" fill="%23ffffff" />
  </svg>`;

  const DEFAULT_PRODUCT_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <rect width="100" height="100" rx="24" fill="%23a855f7" />
    <circle cx="50" cy="45" r="16" fill="%23ffffff" opacity="0.2" />
    <rect x="42" y="24" width="16" height="30" rx="8" fill="%23ffffff" />
    <path d="M32 44 C32 55 40 64 50 64 C60 64 68 55 68 44" stroke="%23ffffff" stroke-width="6" stroke-linecap="round" />
    <line x1="50" y1="64" x2="50" y2="76" stroke="%23ffffff" stroke-width="6" stroke-linecap="round" />
    <line x1="38" y1="76" x2="62" y2="76" stroke="%23facc15" stroke-width="6" stroke-linecap="round" />
  </svg>`;

  // ---------------------------------------------------------------------------
  // The fallback entry that every list keeps
  // ---------------------------------------------------------------------------
  // Product, colour set, font set and variation each ship with one entry under
  // this id. It cannot be deleted or renamed, so every dropdown has something to
  // fall back to when a selection points at nothing - after a deletion, or when
  // a setup from elsewhere names an entry this installation does not have.
  // ---------------------------------------------------------------------------
  // Version of the application. The one place it is written down: the footer
  // shows it, and a release changes it here and nowhere else.
  //
  // Not to be confused with the schema version of a saved setup (CONFIG_VERSION
  // in app.js). That one only moves when the format of the stored data changes,
  // which happens far less often than a release.
  // ---------------------------------------------------------------------------
  const APP_VERSION = '1.1.1';

  const DEFAULT_ID = 'default';

  // ---------------------------------------------------------------------------
  // Menu - the areas of the sidebar, grouped into labelled boxes
  // ---------------------------------------------------------------------------
  // Only ids and icons. What is read on screen comes from i18n.js, under
  // menu.group.<id> and menu.item.<id>.
  const MENU_GROUPS = [
    { id: 'post', items: [
      { id: 'workflow', icon: 'compose' },
      { id: 'export',   icon: 'export' }
    ] },
    { id: 'design', items: [
      { id: 'template', icon: 'template' },
      { id: 'fontset',  icon: 'type' },
      { id: 'colorset', icon: 'swatches' }
    ] },
    { id: 'brand', items: [
      { id: 'products', icon: 'products' },
      { id: 'company',  icon: 'company' }
    ] }
  ];

  // ---------------------------------------------------------------------------
  // Social media target formats
  // ---------------------------------------------------------------------------
  // The name is read from i18n.js under format.<id>; the id itself is shown as
  // the pill label and is the same in every language.
  const SOCIAL_FORMATS = [
    { id: '1:1',  width: 1080, height: 1080, aspect: 1 },
    { id: '9:16', width: 1080, height: 1920, aspect: 9 / 16 },
    { id: '16:9', width: 1920, height: 1080, aspect: 16 / 9 },
    { id: '4:5',  width: 1080, height: 1350, aspect: 4 / 5 }
  ];

  // ---------------------------------------------------------------------------
  // FONT SETS - named variations, mapped to placeholders under TYPOGRAPHY below
  // ---------------------------------------------------------------------------
  // A variation answers "which typeface, tuned how": a family from fonts.js plus
  // values for its variable axes. It deliberately carries no weight and no size -
  // those are hierarchy, and hierarchy belongs to the template.
  //
  // Font sets work like colour sets: several of them, switchable, saved with the
  // setup. Duplicating a set copies its variations, so the ids stay aligned and
  // the placeholder mapping keeps working across sets.
  //
  // Exactly one set ships, holding exactly one variation. Nothing beyond that is
  // prescribed - the typography of a brand is built here, not shipped with the app.
  const DEFAULT_FONTSETS = [
    {
      id: DEFAULT_ID,
      name: 'Default',
      variations: [
        { id: DEFAULT_ID, name: 'Default', font: 'Open Sans', axes: {} }
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // TYPOGRAPHY - which variation and which weight a placeholder uses
  // ---------------------------------------------------------------------------
  // Edited in the Template area, which shows only the placeholders the active
  // template actually declares. The template reads the result as
  // var(--font-<slot>), var(--font-<slot>-weight) and var(--font-<slot>-axes),
  // with the dot of a namespaced slot turned into a dash: product.title becomes
  // --font-product-title. Size stays in the template - its per-format steps are
  // tuned element by element and cannot be expressed by a single number here.
  // Every placeholder starts on the one shipped variation; the weights carry the
  // hierarchy the lower third was designed with. A weight the chosen family does
  // not reach is clamped to its range - Open Sans stops at 800, so the product
  // title starts there rather than at 900.
  const TYPO_DEFAULTS = {
    'title':             { variation: DEFAULT_ID, weight: 800 },
    'subtitle':          { variation: DEFAULT_ID, weight: 600 },
    'description':       { variation: DEFAULT_ID, weight: 400 },
    'tag':               { variation: DEFAULT_ID, weight: 700 },
    'tag2':              { variation: DEFAULT_ID, weight: 700 },
    'product.title':     { variation: DEFAULT_ID, weight: 900 },
    'product.slogan':    { variation: DEFAULT_ID, weight: 400 },
    'company.name':      { variation: DEFAULT_ID, weight: 700 },
    'company.slogan':    { variation: DEFAULT_ID, weight: 400 },
    'company.copyright': { variation: DEFAULT_ID, weight: 400 }
  };

  // The CSS custom property name for a placeholder (dots are not valid in one)
  const fontVar = (slotKey) => '--font-' + slotKey.replace(/\./g, '-');

  // ---------------------------------------------------------------------------
  // COMPANY
  // ---------------------------------------------------------------------------
  const DEFAULT_COMPANY = {
    name: 'YOUR COMPANY',
    slogan: 'Level Up Your Media',
    copyright: '© YOUR COMPANY',
    logo: DEFAULT_COMPANY_LOGO
  };

  // ---------------------------------------------------------------------------
  // PRODUCTS
  // ---------------------------------------------------------------------------
  const DEFAULT_PRODUCTS = [
    { id: DEFAULT_ID, title: 'Default', slogan: '', logo: DEFAULT_PRODUCT_LOGO }
  ];

  // ---------------------------------------------------------------------------
  // COLOUR SETS - reach the template as var(--color-<key>)
  // ---------------------------------------------------------------------------
  // Label and hint come from i18n.js, under role.<key> and role.<key>.hint.
  const COLOR_ROLES = [
    { key: 'background' },
    { key: 'accent' },
    { key: 'secondary' },
    { key: 'border' },
    { key: 'text' },
    { key: 'subtext' },
    { key: 'description' }
  ];

  // Design objects whose colour the colour set maps to a role. This creates no
  // eighth colour - the assignment only points at one of the existing ones. The
  // template reads it as var(--<key>-color). `role` is the fallback for colour
  // sets that say nothing about it (older setups).
  const COLOR_ASSIGNMENTS = [
    { key: 'tag',  role: 'accent' },
    { key: 'tag2', role: 'secondary' }
  ];

  // Every role except the background is offered: the text inside a tag chip is
  // --color-background, so a chip in the background colour would be invisible.
  const ASSIGNABLE_ROLES = COLOR_ROLES.filter(role => role.key !== 'background');

  const DEFAULT_ASSIGN = Object.fromEntries(COLOR_ASSIGNMENTS.map(a => [a.key, a.role]));

  const DEFAULT_COLORSETS = [
    {
      // Neutral and high contrast: safe over any footage, and the one that is
      // always there. The named sets below are the actual design work.
      id: DEFAULT_ID,
      name: 'Default',
      colors: {
        background: '#111827', accent: '#ffffff', secondary: '#9ca3af', border: '#374151',
        text: '#ffffff', subtext: '#d1d5db', description: '#9ca3af'
      },
      assign: { tag: 'accent', tag2: 'secondary' }
    },
    {
      id: 'neon-purple',
      name: 'Neon Purple',
      colors: {
        background: '#180c26', accent: '#facc15', secondary: '#c084fc', border: '#a855f7',
        text: '#ffffff', subtext: '#e9d5ff', description: '#c084fc'
      },
      assign: { tag: 'accent', tag2: 'secondary' }
    },
    {
      id: 'signal-red',
      name: 'Signal Red',
      colors: {
        background: '#1c0a0a', accent: '#38bdf8', secondary: '#f59e0b', border: '#ef4444',
        text: '#ffffff', subtext: '#fecaca', description: '#fca5a5'
      },
      assign: { tag: 'accent', tag2: 'secondary' }
    },
    {
      id: 'cyber-cyan',
      name: 'Cyber Cyan',
      colors: {
        background: '#0a1423', accent: '#f43f5e', secondary: '#38bdf8', border: '#06b6d4',
        text: '#ffffff', subtext: '#cbd5e1', description: '#94a3b8'
      },
      assign: { tag: 'accent', tag2: 'secondary' }
    },
    {
      id: 'mono-dark',
      name: 'Mono Dark',
      colors: {
        background: '#0f172a', accent: '#e2e8f0', secondary: '#94a3b8', border: '#475569',
        text: '#ffffff', subtext: '#cbd5e1', description: '#94a3b8'
      },
      assign: { tag: 'accent', tag2: 'secondary' }
    },
    {
      id: 'mono-light',
      name: 'Mono Light',
      colors: {
        background: '#f8fafc', accent: '#4f46e5', secondary: '#64748b', border: '#cbd5e1',
        text: '#0f172a', subtext: '#334155', description: '#475569'
      },
      assign: { tag: 'accent', tag2: 'secondary' }
    }
  ];

  // ---------------------------------------------------------------------------
  // TEMPLATES
  // ---------------------------------------------------------------------------
  // New template: create an HTML file under templates/ and list its name in
  // templates/manifest.json - no code change needed. Name, description and
  // category are read from <title> and <meta> of the file.
  //
  // This list is only the fallback for a missing or broken manifest, so that the
  // app still starts with the templates that ship with it.
  const TEMPLATE_FILES = [
    'templates/lower-third.html'
  ];

  // Placeholders a template can use through data-slot="..."
  // Label from i18n.js under slot.<key>; source under slotSource.<source>.
  const SLOTS = [
    { key: 'title',               type: 'text',   source: 'creation' },
    { key: 'subtitle',            type: 'text',   source: 'creation' },
    { key: 'description',         type: 'text',   source: 'creation' },
    { key: 'tag',                 type: 'text',   source: 'creation' },
    { key: 'tag2',                type: 'text',   source: 'creation' },
    { key: 'product.title',       type: 'text',   source: 'product' },
    { key: 'product.slogan',      type: 'text',   source: 'product' },
    { key: 'product.logo',        type: 'image',  source: 'product' },
    { key: 'company.name',        type: 'text',   source: 'company' },
    { key: 'company.slogan',      type: 'text',   source: 'company' },
    { key: 'company.copyright',   type: 'text',   source: 'company' },
    { key: 'company.logo',        type: 'image',  source: 'company' }
  ];

  // Per-post content (pure text layer)
  const DEFAULT_CONTENT = {
    title: 'Episode #42: The Ray Tracing Future',
    subtitle: 'Special guest: Alexander Vance',
    description: 'A deep dive into Unreal Engine 5.6, path tracing benchmarks and what the new consoles deliver.',
    tag: 'PODCAST #42',
    tag2: ''
  };

  const DEFAULT_SELECTION = {
    productId: DEFAULT_ID,
    templateId: 'lower-third',
    colorSetId: DEFAULT_ID,
    fontSetId: DEFAULT_ID
  };

  // Expose on window without leaking to global scope
  window.BKG_CONSTANTS = {
    APP_VERSION,
    DEFAULT_ID,
    MENU_GROUPS,
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
    fontVar,
    DEFAULT_CONTENT,
    DEFAULT_SELECTION,
    DEFAULT_COMPANY_LOGO,
    DEFAULT_PRODUCT_LOGO
  };
})();
