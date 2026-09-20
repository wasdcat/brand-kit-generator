// ==============================================================================
// markpublish Official WASDCAT Games Corporate Theme
// Auf Basis des markpublish Default-Themes aufgebaut.
// ==============================================================================

// -----------------------------------------------------------------------------
// Design Tokens & Theming Constants
// -----------------------------------------------------------------------------

// --- Color Palette ---
// Corporate Colors aus dem Logo abgeleitet: Blau ist Struktur, Orange ist Signal.
#let c-primary        = rgb("#1d4a7a")  // Corporate-Blau (Struktur: Linien, Tabellenkopf)
#let c-primary-light  = rgb("#eef3f8")  // Flächen-Blau Tint (Codeblöcke, Tabellenkopf-Hintergrund)
#let c-accent         = rgb("#af521f")  // Signal-Rostorange (Signal: Gliederungsnummern, Links, Checkboxen)
#let c-accent-light   = rgb("#e8813a")  // Signal-Orange aufgehellt für dunklen Grund

// Typografie & Graustufen (Ink-Palette)
#let c-text-dark      = rgb("#0f1c2b")  // ink-strong: Überschriften (H1-H6), Tabellentitel
#let c-text-body      = rgb("#16202b")  // ink: Primärer Fließtext (hoher Lesekontrast)
#let c-text-secondary = rgb("#3d4d5e")  // ink-mid: Zwischenebene, TOC, Untertitel
#let c-text-muted     = rgb("#5b6b7d")  // ink-soft: Metadaten, Beischriften, Kopf- & Fußzeilen
#let c-text-subtle    = rgb("#94a3b8")  // Dezent für Füllpunkte in TOC
#let c-border         = rgb("#d7dee6")  // hairline: Trennlinien in Tabellen
#let c-border-strong  = rgb("#cbd5e1")  // Festere Trennlinien
#let c-bg-subtle      = rgb("#f8fafc")  // Callout- und Infoboxen Hintergrund
#let c-bg-muted       = rgb("#eef3f8")  // Code-Hintergrund & Badges
#let c-white          = rgb("#ffffff")

// Deckblatt-Palette (Inverses Farbsystem für dunklen Verlauf)
#let c-cover-top      = rgb("#17324f")  // Deckblatt-Verlauf oben
#let c-cover-bottom   = rgb("#142a44")  // Deckblatt-Verlauf unten
#let c-cover-bar      = rgb("#0a0c0f")  // Anthrazitbalken am Fuß
#let c-cover-signal   = rgb("#e8813a")  // 3pt Signallinie auf Cover (4,8:1)
#let c-cover-soft     = rgb("#a8b6c6")  // Untertitel & Beischriften auf Cover (6,3:1)

// --- Typography Tokens ---
// Recursive als echter Variable Font ohne Causal-Formatierung (CASL: 0.0 durchgängig Linear)
#let font-family-sans = ("Recursive Sans Linear", "Recursive", "Liberation Sans", "Arial", "Helvetica")
#let font-family-mono = ("Recursive Sans Linear", "Recursive", "Liberation Mono", "Consolas", "Courier New", "monospace")

// --- Radii Tokens ---
#let radius-sm        = 2pt   // Badges, Checkboxen, Inline-Code
#let radius-md        = 4pt   // Callouts, Codeblöcke, TOC-Boxen

// --- Stroke Widths ---
#let stroke-hairline       = 0.35pt // Kopf-/Fußzeilen-Trennlinie
#let stroke-border         = 0.5pt  // Boxrahmen, Codeblöcke
#let stroke-table-divider  = 0.4pt  // Tabellenzeilen-Trenner
#let stroke-table-top      = 1.2pt  // Tabellenkopf- & Abschlusslinie
#let stroke-table-mid      = 0.6pt  // Tabellenkopf-Trennlinie
#let stroke-accent         = 2.0pt  // Akzentlinie
#let stroke-cover-signal   = 3.0pt  // Deckblatt-Signallinie
#let stroke-bar            = 3.0pt  // Infobox-Akzentbalken
#let stroke-callout        = 3.5pt  // Callout-Akzentbalken

// --- Document Layout & Body Typography ---
#let page-paper       = "a4"
#let page-margin      = (top: 2.8cm, bottom: 2.5cm, left: 3.0cm, right: 3.0cm)
#let body-size        = 10pt
#let par-leading      = 0.85em
#let par-spacing      = 1.5em
#let list-spacing     = 1.2em
#let size-code-block    = 8.5pt
#let size-code-inline   = 1.0em
#let weight-code-inline = "medium"

// --- Title & Divider Font Sizes ---
#let size-cover-title      = 30pt
#let size-cover-subtitle   = 13.5pt
#let size-cover-summary    = 10.5pt
#let size-part-title       = 22pt
#let size-part-subtitle    = 12pt
#let size-chapter-title    = 20pt
#let size-chapter-subtitle = 11.5pt
#let size-toc-title        = 16pt

// --- Callout Admonition Colors ---
#let callout-colors = (
  note:      (border: rgb("#1d4a7a"), bg: rgb("#eef3f8"), text: rgb("#14385c")),
  tip:       (border: rgb("#2c7a58"), bg: rgb("#eef7f2"), text: rgb("#1e5a40")),
  important: (border: rgb("#6b4a86"), bg: rgb("#f4f0f8"), text: rgb("#4e3563")),
  warning:   (border: rgb("#a9741a"), bg: rgb("#fbf6ec"), text: rgb("#7d5512")),
  caution:   (border: rgb("#a92f2f"), bg: rgb("#fbf0f0"), text: rgb("#7d2222")),
)

// --- Heading Scale (Level 1..6) ---
#let heading-scales = (
  "1": (size: 18pt,   above: 2.2em, below: 0.6em, weight: 850),
  "2": (size: 14pt,   above: 1.7em, below: 0.5em, weight: 800),
  "3": (size: 11.5pt, above: 1.3em, below: 0.4em, weight: 700),
  "4": (size: 10.5pt, above: 1.1em, below: 0.4em, weight: 700),
  "5": (size: 9.5pt,  above: 1.0em, below: 0.3em, weight: 700),
  "6": (size: 9.0pt,  above: 0.9em, below: 0.3em, weight: 600),
)

// -----------------------------------------------------------------------------
// Component Helpers
// -----------------------------------------------------------------------------

// Summary / Description Callout Box
#let _render-summary-box(
  summary,
  accent-color: c-primary,
  accent-bar: stroke-bar,
  font-size: 10pt,
  text-color: c-text-secondary,
  inset: (x: 12pt, y: 10pt),
  style: "normal",
) = {
  block(
    fill: c-bg-subtle,
    stroke: (left: accent-bar + accent-color),
    inset: inset,
    radius: (right: radius-md),
  )[
    #text(size: font-size, fill: text-color, style: style, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#summary]
  ]
}

// Local Table of Contents for Part and Chapter Dividers
#let _render-local-toc(toc-title, toc-items, is-chapter: false) = {
  if toc-items == none or toc-items.len() == 0 { return }
  block(
    width: 100%,
    fill: c-bg-subtle,
    inset: (x: 14pt, y: if is-chapter { 12pt } else { 14pt }),
    radius: radius-md,
    stroke: stroke-border + c-border,
  )[
    #text(size: 8.5pt, weight: "bold", fill: c-text-secondary, tracking: 0.08em, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#upper(toc-title)]
    #v(if is-chapter { 8pt } else { 10pt })
    #{
      let ch-count = 0
      for item in toc-items {
        if item.at("is_header", default: false) [
          #v(6pt)
          #text(weight: "bold", size: 9.5pt, fill: c-text-dark, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#item.title]
          #v(2pt)
        ] else {
          let lvl = item.at("level", default: if is-chapter { 2 } else { 1 })
          let is-lvl1 = not is-chapter and (lvl == 1)
          if is-lvl1 {
            ch-count += 1
            if ch-count > 1 {
              v(8pt)
            }
          }

          let item-weight = if is-lvl1 { "bold" } else { "regular" }
          let item-size = if is-lvl1 { 9.5pt } else { 9pt }
          let item-color = if is-lvl1 { c-text-dark } else { c-text-secondary }
          let item-indent = if is-lvl1 { 0pt } else { item.at("indent", default: if is-chapter { 0pt } else { 12pt }) }

          grid(
            columns: (1fr, auto),
            align: (left + horizon, right + horizon),
            [
              #h(item-indent)
              #if item.at("slug", default: "") != "" [
                #link(label(item.slug))[#text(size: item-size, weight: item-weight, fill: item-color, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#item.title]]
              ] else [
                #text(size: item-size, weight: item-weight, fill: item-color, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#item.title]
              ]
            ],
            [
              #if item.at("slug", default: "") != "" [
                #context {
                  let locs = query(label(item.slug))
                  if locs.len() > 0 [
                    #text(size: item-size, weight: item-weight, fill: c-text-muted, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#counter(page).at(locs.first().location()).first()]
                  ]
                }
              ]
            ],
          )
          v(if is-lvl1 { 3pt } else { 2.5pt })
        }
      }
    }
  ]
}

// Helper to determine if the current page suppresses headers/footers
#let _is-special-page(cur-page) = {
  let is-cover = query(label("cover-page")).any(it => it.location().page() == cur-page)
  let is-divider = query(selector(label("part-divider")).or(selector(label("chapter-divider")))).any(it => it.location().page() == cur-page)
  is-cover or is-divider
}

// -----------------------------------------------------------------------------
// Markdown Element Customizations
// -----------------------------------------------------------------------------

// Callout / Admonition Box
#let callout(type: "note", title: none, body) = {
  let safe-type = if type in callout-colors { type } else { "note" }
  let c = callout-colors.at(safe-type)
  let icon-file = "assets/icons/" + safe-type + ".svg"

  v(0.6em)
  block(
    width: 100%,
    fill: c.bg,
    stroke: (left: stroke-callout + c.border),
    inset: (top: 10pt, bottom: 10pt, left: 14pt, right: 14pt),
    radius: (right: radius-md),
  )[
    #if title != none [
      #grid(
        columns: (auto, 1fr),
        gutter: 8pt,
        align: (center + horizon, left + horizon),
        image(icon-file, width: 11pt, height: 11pt),
        text(weight: "bold", fill: c.text, size: 10pt, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#title]
      )
    ]
    #block(above: if title != none { 7pt } else { 0pt })[
      #text(size: 9.5pt, fill: c-text-body, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#body]
    ]
  ]
  v(0.6em)
}

// Task Item Checkbox -- Signal-Farbe (Orange) für aktiven Haken
#let task-item(checked: false, body) = {
  block(spacing: list-spacing)[
    #grid(
      columns: (14pt, 1fr),
      align: (left + top, left + top),
      box(
        width: 9.5pt,
        height: 9.5pt,
        stroke: 0.8pt + (if checked { c-accent } else { c-text-muted }),
        radius: radius-sm,
        fill: if checked { c-accent } else { none },
        baseline: 0pt,
        inset: (top: 1pt),
      )[
        #if checked [
          #align(center + horizon)[#image("assets/icons/checkbox-check.svg", width: 7.5pt, height: 7.5pt)]
        ]
      ],
      body,
    )
  ]
}

// Metadatenraster-Felder des Titelblatts
#let cover-fields(meta) = (
  meta.at("version", default: none),
  meta.at("author", default: none),
  meta.at("status", default: none),
  meta.at("date", default: none),
)

// Wie ein Metadatenwert im Titelblatt erscheint
#let meta-value(value, labels) = {
  if type(value) == bool {
    if value { labels.at("bool_true", default: "Ja") } else { labels.at("bool_false", default: "Nein") }
  } else if type(value) == array {
    value.map(v => meta-value(v, labels)).join(", ")
  } else {
    str(value)
  }
}

// -----------------------------------------------------------------------------
// Global Document Setup
// -----------------------------------------------------------------------------

#let setup-document(
  language: "de",
  show-cover: true,
  show-toc: true,
  toc-title: "Inhaltsverzeichnis",
  toc-depth: 3,
  show-header: true,
  show-footer: true,
  meta: (:),
  labels: (:),
  body,
) = {
  let title = meta.at("title").value
  let subtitle = meta.at("subtitle").value
  let summary = meta.at("summary").value
  let version = meta.at("version").value
  let date = meta.at("date").value
  let copyright = meta.at("copyright").value

  // Optionales Klassifizierungsfeld (z. B. "Intern")
  let classification = meta.at("classification", default: (value: none)).value
  let has-classification = classification != none and classification != ""

  // PDF-Dokumentmetadaten
  set document(
    title: if title != none and title != "" { title } else { none },
    author: if meta.at("author", default: none) != none and meta.at("author").value != none and meta.at("author").value != "" {
      let a = meta.at("author").value
      if type(a) == array { a.map(str) } else { (str(a),) }
    } else { () },
  )

  // Grundlegendes Seiten-Setup
  set page(
    paper: page-paper,
    margin: page-margin,
    header: context {
      let cur-page = here().page()
      if show-header and not _is-special-page(cur-page) {
        let all-h = query(selector(heading.where(level: 1)))
        let chapter-h = all-h.filter(h => not (h.has("label") and (str(h.label) == "part-entry" or str(h.label) == "chapter-divider")))
        let on-p = chapter-h.filter(h => h.location().page() == cur-page)
        let before-p = chapter-h.filter(h => h.location().page() < cur-page)
        let active = if on-p.len() > 0 { on-p.first() } else if before-p.len() > 0 { before-p.last() } else { none }
        let num-str = if active != none and active.numbering != none {
          let n = counter(heading).at(active.location())
          numbering(active.numbering, ..n)
        } else { none }
        let ch-title = if active != none and active.location().page() <= cur-page {
          if num-str != none and str(num-str).trim() != "" [ #text(fill: c-accent)[#num-str] #h(0.3em) #active.body ] else [ #active.body ]
        } else { "" }
        set text(hyphenate: false, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))
        grid(
          columns: (1fr, 1fr),
          column-gutter: 12pt,
          align: (left + top, right + top),
          [
            #text(size: 8.5pt, weight: "semibold", fill: c-text-secondary)[#title]
            #if subtitle != "" and subtitle != none [
              \ #text(size: 7.5pt, fill: c-text-muted)[#subtitle]
            ]
          ],
          [
            #text(size: 8.5pt, fill: c-text-muted)[#ch-title]
          ],
        )
        v(-2pt)
        line(length: 100%, stroke: stroke-hairline + c-border)
      }
    },
    footer: context {
      let cur-page = here().page()
      if show-footer and not _is-special-page(cur-page) {
        let doc-ends = query(label("doc-end"))
        let total-pages = if doc-ends.len() > 0 { doc-ends.last().location().page() } else { 1 }
        set text(font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))
        line(length: 100%, stroke: stroke-hairline + c-border)
        v(-2pt)
        grid(
          columns: (1fr, 1fr),
          align: (left + top, right + top),
          [
            #if copyright != "" and copyright != none [
              #text(size: 8pt, fill: c-text-muted)[#copyright]
            ]
          ],
          [
            #text(size: 8pt, fill: c-text-muted)[
              #if version != "" and version != none [#version]
              #if version != "" and version != none and date != "" and date != none [ | ]
              #if date != "" and date != none [#date]
            ]
            \ #text(size: 8pt, fill: c-text-muted)[#labels.at("page", default: "Seite") #counter(page).display() #labels.at("page_of", default: "von") #total-pages]
          ],
        )
      }
    }
  )

  // Typography Settings: Recursive Variable Font ohne Casual (CASL: 0.0)
  set text(
    font: font-family-sans,
    size: body-size,
    lang: language,
    hyphenate: true,
    fill: c-text-body,
    variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0),
  )
  set par(
    justify: true,
    leading: par-leading,
    spacing: par-spacing,
  )
  set list(
    spacing: list-spacing,
    marker: (text(fill: c-primary)[•], text(fill: c-primary)[–], text(fill: c-primary)[·]),
  )
  set enum(
    spacing: list-spacing,
  )
  set terms(
    spacing: list-spacing,
    tight: false,
  )

  // Heading Styling: Gliederungsnummer in Signal-Orange, Text in Ink-Strong
  show heading: it => {
    set par(justify: false)
    set text(hyphenate: false, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))
    if it.has("label") and str(it.label) == "part-entry" {
      text(size: size-part-title, weight: 900, fill: c-text-dark)[#it.body]
    } else if it.has("label") and str(it.label) == "chapter-divider" {
      none
    } else {
      let cfg = heading-scales.at(str(it.level), default: heading-scales.at("4"))
      v(cfg.above)
      let num = if it.numbering != none { counter(heading).display(it.numbering) } else { none }
      let h-text = if num != none and str(num).trim() != "" [
        #text(fill: c-accent)[#num] #it.body
      ] else [ #it.body ]
      text(
        fill: c-text-dark,
        weight: cfg.weight,
        size: cfg.size,
      )[
        #context block(width: 100%, above: par.spacing, below: par.spacing, sticky: true)[#h-text]
      ]
      v(cfg.below)
    }
  }

  // Links styling: Web URLs in Signal-Orange mit feiner Unterstreichung
  show link: it => {
    if type(it.dest) == str {
      text(fill: c-accent, underline(stroke: 0.5pt + c-accent.lighten(55%), offset: 2pt)[#it])
    } else {
      it
    }
  }

  // Images styling: Alle Bilder horizontal zentrieren
  show image: it => align(center, it)

  // Outline / TOC styling (Abstände wie gehabt)
  show outline.entry: it => {
    let elem = it.element
    let all-outlined = query(selector(heading.where(outlined: true)))
    let is-first-toc = all-outlined.len() > 0 and elem.location() == all-outlined.first().location()
    let elem-idx = all-outlined.position(h => h.location() == elem.location())
    let follows-part = if elem-idx != none and elem-idx > 0 {
      let prev = all-outlined.at(elem-idx - 1)
      prev.has("label") and str(prev.label) == "part-entry"
    } else {
      false
    }

    if elem.has("label") and str(elem.label) == "part-entry" {
      let num = if elem.numbering != none {
        numbering(elem.numbering, ..counter(heading).at(elem.location()))
      } else { none }
      let pg = counter(page).at(elem.location()).first()
      if not is-first-toc {
        v(1.8em)
      }
      link(elem.location())[
        #text(weight: 850, size: 11pt, fill: c-primary, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#if num != none [#num #h(0.35em)]#elem.body]
        #box(width: 1fr)
        #text(weight: 850, size: 11pt, fill: c-text-dark, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#pg]
      ]
      v(0.85em)
    } else if it.level == 1 {
      if not is-first-toc and not follows-part {
        v(0.9em)
      }
      let num = if elem.numbering != none {
        numbering(elem.numbering, ..counter(heading).at(elem.location()))
      } else { none }
      let pg = counter(page).at(elem.location()).first()
      link(elem.location())[
        #text(weight: 800, fill: c-text-dark, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#if num != none and str(num).trim() != "" [#text(fill: c-accent)[#num] #h(0.35em)]#elem.body]
        #box(width: 1fr, text(fill: c-text-subtle)[#it.fill])
        #text(weight: 800, fill: c-text-dark, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#pg]
      ]
    } else {
      text(weight: "regular", fill: c-text-secondary, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#it]
    }
  }

  // Table styling: Booktabs-Stil mit Corporate-Blau
  set table(
    stroke: (x, y) => if y == 0 {
      (top: stroke-table-top + c-primary, bottom: stroke-table-mid + c-primary)
    } else {
      (bottom: stroke-table-divider + c-border)
    },
    fill: (x, y) => if y == 0 { c-primary-light } else { none },
    inset: (top: 7pt, bottom: 7pt, left: 10pt, right: 10pt),
  )
  show table: set par(justify: false)
  show table: set text(number-width: "tabular", font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))
  show table: it => block(stroke: (bottom: stroke-table-top + c-primary))[#it]

  // Code Block styling -- Echter Monospace-Satz über MONO: 1.0 (ohne Casual)
  show raw: set text(font: font-family-mono, variations: (CASL: 0.0, CRSV: 0.5, MONO: 1.0))
  show raw.where(block: true): it => block(
    fill: c-bg-muted,
    stroke: stroke-border + c-primary.lighten(65%),
    inset: 10pt,
    radius: radius-md,
    width: 100%,
    text(font: font-family-mono, size: size-code-block, variations: (CASL: 0.0, CRSV: 0.5, MONO: 1.0))[#it]
  )
  show raw.where(block: false): it => highlight(
    fill: c-bg-muted,
    radius: radius-sm,
    extent: 1.5pt,
    top-edge: "ascender",
    bottom-edge: "descender",
  )[#text(fill: c-text-dark, font: font-family-mono, size: size-code-inline, weight: weight-code-inline, variations: (CASL: 0.0, CRSV: 0.5, MONO: 1.0))[#it]]

  // ---------------------------------------------------------------------------
  // Deckblatt (Dark Cover mit Wappen & Studio-Signet)
  // ---------------------------------------------------------------------------
  if show-cover {
    page(margin: 0pt, header: none, footer: none, {
      [#metadata("cover") <cover-page>]
      set par(justify: false)
      set text(hyphenate: false, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))

      grid(
        rows: (1fr, auto),

        // Dunkelblauer Verlauf mit Logo, Titel, Signallinie und Metadaten
        block(
          width: 100%,
          height: 100%,
          fill: gradient.linear(c-cover-top, c-cover-bottom, angle: 90deg),
          inset: (x: 25mm, top: 22mm, bottom: 16mm),
        )[
          #align(center)[
            // Logo und "WASDCAT Games / Independent Game Studio" nebeneinander
            // als horizontales Signet auf gleicher Y-Mittellinie.
            #box[
              #grid(
                columns: (auto, auto),
                gutter: 15pt,
                align: (horizon, horizon + left),
                image("assets/logos/wasdcat_logo.svg", width: 28mm),
                context {
                  let studio-name = labels.at("studio_name", default: "WASDCAT Games")
                  let tagline-str = upper(str(labels.at("studio_tagline", default: "INDEPENDENT GAME STUDIO")))
                  let title-w = measure(text(size: 20pt, weight: 1000, tracking: 0.01em)[#studio-name]).width
                  let raw-w = measure(text(size: 8pt, weight: 600, tracking: 0em)[#tagline-str]).width
                  let chars = tagline-str.clusters().len()
                  let auto-tracking = if chars > 1 { (title-w - raw-w) / (chars - 1) } else { 0.329em }
                  stack(
                    spacing: 3.0mm,
                    text(size: 20pt, weight: 1000, fill: c-white, tracking: 0.01em)[#studio-name],
                    text(size: 8pt, weight: 600, fill: c-cover-soft, tracking: auto-tracking)[#tagline-str],
                  )
                },
              )
            ]

            #v(0.7fr)

            // Titel und Untertitel in optischer Mitte mit symmetrischer 3pt-Signallinie
            #stack(
              spacing: 0pt,
              text(size: size-cover-title, weight: 1000, fill: c-white)[#title],
              v(11mm),
              line(length: 28mm, stroke: stroke-cover-signal + c-cover-signal),
              if subtitle != none and subtitle != "" [
                #v(11mm)
                #text(size: size-cover-subtitle, fill: c-cover-soft)[#subtitle]
              ],
            )

            // Kurzbeschreibung aus `summary:`
            #if summary != none and summary != "" [
              #v(13mm)
              #block(width: 108mm)[
                #set par(leading: 0.75em)
                #text(size: size-cover-summary, fill: c-cover-soft)[#summary]
              ]
            ]

            #v(1.3fr)

            // Horizontale Metadaten-Tabelle
            #let meta-items = cover-fields(meta).filter(
              it => it != none and it.value != none and it.value != () and str(it.value).trim() != ""
            )
            #if meta-items.len() > 0 [
              #box[
                #grid(
                  columns: meta-items.map(_ => auto),
                  column-gutter: 12mm,
                  row-gutter: 0mm,
                  align: center,
                  ..meta-items.map(it => text(size: 8pt, weight: 600, fill: c-cover-soft, tracking: 0.12em)[
                    #upper(if it.label != none and it.label != "" { it.label } else { it.key })
                  ]),
                  ..meta-items.map(_ => v(2mm) + line(length: 100%, stroke: 0.6pt + c-cover-soft.lighten(20%)) + v(2mm)),
                  ..meta-items.map(it => text(size: 10pt, weight: 400, fill: c-white)[#meta-value(it.value, labels)]),
                )
              ]
            ]
            #v(4mm)
          ]
        ],

        // Anthrazitbalken am Fuß mit zentrierter Copyright-Angabe
        block(
          width: 100%,
          height: 16mm,
          fill: c-cover-bar,
          inset: (x: 25mm, bottom: 1pt),
        )[
          #align(center + horizon)[
            #if copyright != none and copyright != "" [
              #text(
                size: 9pt,
                fill: c-cover-soft,
                tracking: 0.04em,
                top-edge: "cap-height",
                bottom-edge: "baseline",
              )[#copyright]
            ]
          ]
        ],
      )

      // Optionale Kennzeichnungs-Marke ("Intern" etc.)
      if has-classification {
        place(
          top + center,
          block(
            width: 70mm,
            fill: c-cover-signal,
            inset: (top: 3.5mm, bottom: 3mm),
            radius: (bottom: 2.5mm),
            align(center)[
              #text(
                size: 8.5pt,
                weight: 700,
                fill: c-cover-top,
                tracking: 0.16em,
                top-edge: "cap-height",
                bottom-edge: "baseline",
              )[#h(0.16em)#upper(str(classification))]
            ],
          ),
        )
      }
    })
  }

  // Table of Contents
  if show-toc {
    v(1cm)
    text(size: size-toc-title, weight: 850, fill: c-text-dark, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))[#toc-title]
    v(1cm)
    outline(
      title: none,
      depth: toc-depth,
      indent: 1.2em,
    )
    v(1cm)
    pagebreak()
  }

  body
  [#metadata("end") <doc-end>]
}

// -----------------------------------------------------------------------------
// Divider Pages (Part & Chapter)
// -----------------------------------------------------------------------------

// Part Divider Page
#let render-part-divider(
  title: "",
  subtitle: none,
  summary: none,
  tag: "ABSCHNITT",
  number: none,
  in-toc: true,
  toc-title: "Inhalt dieses Abschnitts",
  toc-items: (),
) = {
  [#metadata("part-divider") <part-divider>]
  block(width: 100%, breakable: false)[
    #set par(justify: false)
    #set text(hyphenate: false, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))
    #v(3cm)
    #let has-number = number != none and number != ""
    #let tag-word = upper(str(tag)).trim()
    #let tag-line = if has-number and tag-word != "" {
      tag-word + " " + number
    } else if has-number {
      number
    } else {
      tag-word
    }
    #if tag-line != "" [
      #text(size: 10pt, weight: "bold", fill: c-accent, tracking: 0.1em)[#tag-line]
      #v(0.3em)
    ]
    #let num-fn = if has-number { (..nums) => number } else { none }
    #if in-toc [
      #heading(level: 1, outlined: true, numbering: num-fn)[#title] <part-entry>
    ] else [
      #text(size: size-part-title, weight: 900, fill: c-text-dark)[#title]
    ]
    #v(0.5em)
    #line(length: 100%, stroke: stroke-accent + c-primary)
    #v(1.5em)

    #if subtitle != none and subtitle != "" [
      #text(size: size-part-subtitle, fill: c-text-muted)[#subtitle]
      #v(1em)
    ]

    #if summary != none and summary != "" [
      #_render-summary-box(
        summary,
        accent-color: c-primary,
        font-size: 10pt,
        text-color: c-text-secondary,
        inset: (x: 12pt, y: 10pt),
        style: "normal",
      )
      #v(2em)
    ]

    #if toc-items.len() > 0 [
      #_render-local-toc(toc-title, toc-items, is-chapter: false)
    ]
  ]
  pagebreak()
}

// Chapter Divider Page
#let render-chapter-divider(
  title: "",
  subtitle: none,
  summary: none,
  tag: "KAPITEL",
  toc-title: "Inhalt dieses Kapitels",
  toc-items: (),
) = {
  [#heading(level: 1, outlined: false, numbering: none)[#title] <chapter-divider>]
  block(width: 100%, breakable: false)[
    #set par(justify: false)
    #set text(hyphenate: false, font: font-family-sans, variations: (CASL: 0.0, CRSV: 0.5, MONO: 0.0))
    #v(3cm)
    #let tag-line = upper(str(tag)).trim()
    #if tag-line != "" [
      #text(size: 9pt, weight: "bold", fill: c-text-muted, tracking: 0.1em)[#tag-line]
      #v(0.3em)
    ]
    #text(size: size-chapter-title, weight: 850, fill: c-text-dark)[#title]
    #v(0.5em)
    #line(length: 100%, stroke: 1pt + c-border-strong)
    #v(1.5em)

    #if subtitle != none and subtitle != "" [
      #text(size: size-chapter-subtitle, fill: c-text-muted)[#subtitle]
      #v(1em)
    ]

    #if summary != none and summary != "" [
      #_render-summary-box(
        summary,
        accent-color: c-text-muted,
        font-size: 9.5pt,
        text-color: c-text-secondary,
        inset: (x: 12pt, y: 10pt),
        style: "normal",
      )
      #v(2em)
    ]

    #if toc-items.len() > 0 [
      #_render-local-toc(toc-title, toc-items, is-chapter: true)
    ]
  ]
  pagebreak()
}
