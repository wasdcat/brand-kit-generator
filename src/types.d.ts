/**
 * WASDCAT Brand Kit Generator - shape of the data model
 *
 * Type declarations only, for editor completion and type checking. Nothing
 * imports this file and nothing is compiled: the app stays no-build, plain
 * browser JavaScript. Editors pick the file up on their own because it sits
 * next to the sources.
 *
 * To have VS Code check the sources against it, add to a source file:
 *   // @ts-check
 * or enable "js/ts.implicitProjectConfig.checkJs" for the workspace.
 *
 * The canonical values live in constants.js and fonts.js; this file describes
 * their structure, not their content.
 */

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

/**
 * The id every kind of set falls back to. Normalising never leaves a dangling
 * reference: a missing or deleted target is replaced with this one.
 */
type DefaultId = 'default';

/** Id of a product, colour set, font set or variation. */
type EntityId = string;

// ---------------------------------------------------------------------------
// Output formats
// ---------------------------------------------------------------------------

/** The aspect ratios the app renders and exports. */
type FormatId = '1:1' | '9:16' | '16:9' | '4:5';

interface SocialFormat {
  id: FormatId;
  /** Human readable, e.g. "9:16 Story / Reel / TikTok". */
  name: string;
  /** Pixel width of the exported PNG. */
  width: number;
  /** Pixel height of the exported PNG. */
  height: number;
  /** width / height, precomputed. */
  aspect: number;
}

// ---------------------------------------------------------------------------
// Placeholders
// ---------------------------------------------------------------------------

/**
 * A placeholder a template can fill through `data-slot="..."`. Text slots get
 * their content set via textContent, image slots via the src of an <img>.
 */
type SlotKey =
  | 'title'
  | 'subtitle'
  | 'description'
  | 'tag'
  | 'tag2'
  | 'product.title'
  | 'product.slogan'
  | 'product.logo'
  | 'company.name'
  | 'company.slogan'
  | 'company.copyright'
  | 'company.logo';

interface SlotDefinition {
  key: SlotKey;
  type: 'text' | 'image';
  label: string;
  /** Which area of the UI the value is edited in. */
  source: string;
}

// ---------------------------------------------------------------------------
// Colours
// ---------------------------------------------------------------------------

/**
 * The seven semantic roles. A colour set assigns one colour per role; the
 * template reads them as `var(--color-<role>)`.
 */
type ColorRole =
  | 'background'
  | 'accent'
  | 'secondary'
  | 'border'
  | 'text'
  | 'subtext'
  | 'description';

/** Every role except `background`, which would make chip text invisible. */
type AssignableRole = Exclude<ColorRole, 'background'>;

/** A design object whose colour points at a role rather than carrying its own. */
type AssignmentKey = 'tag' | 'tag2';

interface ColorRoleDefinition {
  key: ColorRole;
  label: string;
  /** Short explanation shown as a tooltip. */
  hint: string;
}

interface ColorAssignmentDefinition {
  key: AssignmentKey;
  label: string;
  /** Role used when a colour set says nothing about this object. */
  role: AssignableRole;
}

/** CSS hex colour, e.g. "#180c26". */
type HexColor = string;

interface ColorSet {
  id: EntityId;
  name: string;
  /** One colour per role. Missing roles fall back to the default set. */
  colors: Record<ColorRole, HexColor>;
  /**
   * Which role each design object points at. Creates no eighth colour - the
   * template reads the result as `var(--<key>-color)`.
   */
  assign: Record<AssignmentKey, AssignableRole>;
}

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

/** Family name as declared in fonts/fonts.css, e.g. "Recursive". */
type FontFamilyId = string;

/** OpenType variation axis tag, e.g. "CASL", "MONO", "slnt". */
type AxisTag = string;

/** One adjustable axis of a family, rendered as a slider. */
interface FontAxis {
  tag: AxisTag;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  /** What moving the slider does, in plain words. */
  hint: string;
}

/** An entry of the bundled font catalogue (fonts.js). */
interface FontFamily {
  id: FontFamilyId;
  name: string;
  note: string;
  /**
   * Weight range the family supports, as a CSS range string, e.g. "300 1000".
   * Documentation only: weight is set per placeholder, not per family.
   */
  weight: string;
  /** Axes worth exposing. An empty list means no sliders. */
  axes: FontAxis[];
}

/**
 * A named point in a family's design space: the family plus a value per axis.
 * Weight is deliberately not part of it - that belongs to the placeholder.
 */
interface FontVariation {
  id: EntityId;
  name: string;
  font: FontFamilyId;
  /** Axis values, keyed by tag. Axes left out use the family's default. */
  axes: Record<AxisTag, number>;
}

interface FontSet {
  id: EntityId;
  name: string;
  /** Always at least one entry; normalising restores a default variation. */
  variations: FontVariation[];
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

/**
 * What one placeholder uses. Size is not here on purpose: its per-format steps
 * are tuned element by element and stay in the template's CSS.
 */
interface TypographyEntry {
  /** Id of a variation in the active font set. */
  variation: EntityId;
  /** Clamped to the range the chosen family supports. */
  weight: number;
}

/**
 * Placeholder to font mapping. The template reads each entry as
 * `var(--font-<slot>)`, `var(--font-<slot>-weight)` and
 * `var(--font-<slot>-axes)`, with dots turned into dashes:
 * `product.title` becomes `--font-product-title`.
 */
type TypographyMapping = Partial<Record<SlotKey, TypographyEntry>>;

// ---------------------------------------------------------------------------
// Brand and content
// ---------------------------------------------------------------------------

/** Data URL of an uploaded or bundled image. */
type DataUrl = string;

interface Company {
  name: string;
  slogan: string;
  copyright: string;
  logo: DataUrl;
}

interface Product {
  id: EntityId;
  title: string;
  slogan: string;
  logo: DataUrl;
}

/** The text of the post being made. Empty fields disappear in the template. */
interface Content {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  tag2: string;
}

/** What is currently picked in each of the four selectors. */
interface Selection {
  productId: EntityId;
  /** Template id, i.e. its file name without the extension. */
  templateId: string;
  colorSetId: EntityId;
  fontSetId: EntityId;
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

/**
 * A template file after it has been read. Name, description and category come
 * from the file's <title> and <meta> tags, the slots from its markup.
 */
interface TemplateEntry {
  /** File name without the extension, e.g. "lower-third". */
  id: string;
  /** Path as the app loads it, e.g. "templates/lower-third.html". */
  file: string;
  name: string;
  description: string;
  category: string;
  /** Placeholders the file declares via data-slot / data-show-if. */
  slots: string[];
  /** Of those, the ones the app has no definition for. */
  unknownSlots: string[];
  /** Empty when the file loaded and has a .frame element. */
  error: string;
}

/** templates/manifest.json - which template files exist. */
interface TemplateManifest {
  /** File names relative to the manifest, e.g. ["lower-third.html"]. */
  templates: string[];
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

/** Everything a stage needs to fill one template for one format. */
interface RenderState {
  format: SocialFormat;
  colors: Record<ColorRole, HexColor>;
  assign: Record<AssignmentKey, AssignableRole>;
  typography: TypographyMapping;
  company: Company;
  product: Product;
  content: Content;
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

/**
 * What localStorage holds and what a JSON backup contains. Older backups may
 * be missing keys; the normalisers fill them in on load.
 */
interface SetupSnapshot {
  /**
   * Always "wasdcat-bkg-config". An import that does not find it rejects the
   * file, so this is what makes a setup recognisable as ours.
   */
  id: 'wasdcat-bkg-config';
  /**
   * Schema version, e.g. "1.0". Raised only when the format changes in a way
   * older data cannot survive. A snapshot with a newer major version is still
   * read; the parts this build does not know are skipped.
   */
  version: string;
  /** ISO timestamp of when it was written. */
  exportedAt: string;
  company: Company;
  products: Product[];
  colorSets: ColorSet[];
  fontSets: FontSet[];
  typography: TypographyMapping;
  content: Content;
  selection: Selection;
  /**
   * Ids of templates taken out of the catalogue. The files stay under
   * `src/templates/` and remain listed in the manifest - a browser cannot
   * delete them - so this is what the Template area restores from.
   */
  hiddenTemplates: string[];
}
