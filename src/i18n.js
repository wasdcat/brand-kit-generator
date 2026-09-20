/**
 * WASDCAT Brand Kit Generator - interface languages
 *
 * Two languages, English and German. Which one is used follows, in this order:
 *   1. an explicit choice, kept in localStorage
 *   2. the language the browser reports
 *   3. English
 *
 * English is also the fallback for a single missing key: a string that only
 * exists in EN still shows up in German rather than leaving a blank or a key.
 * That way a new label is visible from the moment it is written, and translating
 * it is a separate step that cannot break the interface.
 *
 * Keys are flat and dotted, grouped by where they appear. Templates read them
 * through t('...'); a value may carry {placeholders} which t() fills in.
 *
 * Deliberately NOT translated:
 *   - names of colour sets, font sets, products and the sample content. That is
 *     the user's data, not the interface. It must not change under them when
 *     they switch language.
 *   - "Default", the fallback entry of every list. It is a token the interface
 *     treats specially, not a word to read.
 *   - font family names and the format ids ("16:9").
 */
(function () {
  const LANGS = ['en', 'de'];
  const FALLBACK = 'en';

  const en = {
    // -- Application shell ---------------------------------------------------
    'app.title': 'Brand Kit Generator',
    'app.by': 'by',
    'app.version': 'Version {version}',

    'header.load': 'Load',
    'header.loadTitle': 'Load a saved setup from a JSON file',
    'header.save': 'Save',
    'header.saveTitle': 'Save the current setup as JSON',
    'header.themeToLight': 'Switch to Default Light',
    'header.themeToDark': 'Switch to Default Dark',
    'header.langTitle': 'Switch the interface language',
    'header.reset': 'Reset to factory defaults',
    'header.resetArmed': 'Click again to discard everything',
    'header.resetConfirm': 'Discard everything?',

    // -- Preview -------------------------------------------------------------
    'preview.bgCheckerDark': 'Dark transparency pattern',
    'preview.bgCheckerLight': 'Light transparency pattern',
    'preview.bgBlack': 'Black background',
    'preview.bgWhite': 'White background',
    'preview.bgUpload': 'Upload a background image (exported with the overlay)',
    'preview.bgExpectedTitle': 'This setup was saved without its background. Pick “{name}” and the framing is already in place.',
    'preview.bgFraming': 'Framing: drag to move, scroll to zoom, double-click or click here to reset',
    'preview.bgRemove': 'Remove the background image',
    'preview.frameTitle': 'Template preview',
    'preview.exportFrameTitle': 'Export',
    'preview.templateFailed': 'The template could not be rendered',

    // -- Footer --------------------------------------------------------------
    'footer.nav': 'About this app',
    'footer.project': 'Project Home',
    'footer.projectTitle': 'Source code and issues on GitHub',
    'footer.manual': 'Manual',
    'footer.manualTitle': 'The manual as a PDF',
    'footer.licence': 'License',
    'footer.licenceTitle': 'MIT. The bundled fonts have their own licenses in fonts/LICENSES.txt',
    'footer.imprint': 'Imprint',
    'footer.imprintTitle': 'Legal notice',

    // -- Import dialog -------------------------------------------------------
    'import.heading': 'Load setup?',
    'import.warningBefore': 'This ',
    'import.warningStrong': 'replaces the current setup',
    'import.warningAfter': ' — company, products, colour sets, font sets and the post content. Anything not saved as a JSON backup is gone.',
    'import.version': 'Version',
    'import.contains': 'Contains',
    'import.containsNothing': 'nothing this app reads',
    'bgswap.heading': 'A different picture?',
    'bgswap.explain': 'The setup you loaded is waiting for {expected}, and the framing it brought was measured against that picture. Taking {picked} instead drops it - every template and every format goes back to the full picture.',
    'bgswap.expected': 'Waiting for',
    'bgswap.picked': 'You picked',
    'bgswap.confirm': 'Use it and drop the framing',
    'save.heading': 'Save the background with it?',
    'save.explain': 'Everything else in a setup is text and weighs next to nothing. A picture does not, so it is your call.',
    'save.withImage': 'With the picture',
    'save.withImageHint': 'One complete file. Larger, and awkward to send by mail.',
    'save.withoutImage': 'Without the picture',
    'save.withoutImageHint': 'Small file. It keeps the framing and names the picture, which you pick again after loading.',
    'import.cancel': 'Cancel',
    'import.confirm': 'Replace setup',
    'import.unknownVersion': 'unknown',

    // -- Menu ----------------------------------------------------------------
    'menu.group.post': 'Post',
    'menu.group.design': 'Design',
    'menu.group.brand': 'Brand',
    'menu.item.workflow': 'Creation',
    'menu.item.export': 'Export',
    'menu.item.template': 'Template',
    'menu.item.fontset': 'Font set',
    'menu.item.colorset': 'Colour set',
    'menu.item.products': 'Products',
    'menu.item.company': 'Company',

    // -- Output formats ------------------------------------------------------
    'format.1:1': '1:1 Square',
    'format.9:16': '9:16 Vertical',
    'format.16:9': '16:9 Landscape',
    'format.4:5': '4:5 Portrait',

    // -- Colour roles --------------------------------------------------------
    'role.background': 'Background',
    'role.background.hint': 'Areas, e.g. the box',
    'role.accent': 'Accent',
    'role.accent.hint': 'Highlights, e.g. product name, tag',
    'role.secondary': 'Secondary',
    'role.secondary.hint': 'Second accent colour, e.g. gradient middle',
    'role.border': 'Border',
    'role.border.hint': 'Edges and rules',
    'role.text': 'Text',
    'role.text.hint': 'Body text, e.g. the title',
    'role.subtext': 'Subtext',
    'role.subtext.hint': 'Second text level, e.g. the subtitle',
    'role.description': 'Description',
    'role.description.hint': 'Smallest text level',
    'assign.tag': 'Tag 1',
    'assign.tag2': 'Tag 2',

    // -- Placeholders --------------------------------------------------------
    'slot.title': 'Title',
    'slot.subtitle': 'Subtitle',
    'slot.description': 'Description',
    'slot.tag': 'Tag 1',
    'slot.tag2': 'Tag 2',
    'slot.product.title': 'Product title',
    'slot.product.slogan': 'Product slogan',
    'slot.product.logo': 'Product logo',
    'slot.company.name': 'Company name',
    'slot.company.slogan': 'Company slogan',
    'slot.company.copyright': 'Company copyright',
    'slot.company.logo': 'Company logo',
    'slotSource.creation': 'Creation',
    'slotSource.product': 'Product',
    'slotSource.company': 'Company',

    // -- Font axes -----------------------------------------------------------
    'axis.CASL': 'Casual',
    'axis.CASL.hint': 'technical to handwritten',
    'axis.MONO': 'Monospace',
    'axis.MONO.hint': 'proportional to fixed width',
    'axis.slnt': 'Slant',
    'axis.slnt.hint': 'upright to slanted',
    'axis.CRSV': 'Cursive forms',
    'axis.CRSV.hint': '0.5 follows the slant',
    'axis.wdth': 'Width',
    'axis.wdth.hint': 'condensed to extended',
    'axis.SOFT': 'Softness',
    'axis.SOFT.hint': 'sharp to rounded edges',
    'axis.WONK': 'Wonky',
    'axis.WONK.hint': 'switches to the quirky letterforms',

    // -- Font families -------------------------------------------------------
    'font.Recursive.note': 'WASDCAT corporate typeface. Five axes, the most adjustable family here.',
    'font.Orbitron.note': 'Gaming display face. Wide, geometric, technical.',
    'font.Archivo.note': 'Workhorse grotesque with an adjustable width.',
    'font.Inter.note': 'Neutral face for content. Highly legible at small sizes.',
    'font.Space Grotesk.note': 'Technical grotesque with character.',
    'font.Fraunces.note': 'Editorial serif with soft and quirky axes.',
    'font.Open Sans.note': 'The interface font of this app. Quiet and dependable.',

    // -- Messages ------------------------------------------------------------
    'msg.productCreated': 'New product created.',
    'msg.productDuplicated': 'Product duplicated.',
    'msg.productDeleted': 'Product deleted.',
    'msg.svgRejected': 'Invalid or unsafe SVG file.',
    'msg.colorSetDuplicated': 'Colour set duplicated.',
    'msg.colorSetDeleted': 'Colour set deleted.',
    'msg.colorSetNoFactory': 'This colour set has no factory state.',
    'msg.setReset': '"{name}" reset to its default.',
    'msg.colorSetActivated': 'Colour set activated for the preview.',
    'msg.fontSetDuplicated': 'Font set duplicated.',
    'msg.fontSetDeleted': 'Font set deleted.',
    'msg.fontSetNoFactory': 'This font set has no factory state.',
    'msg.fontSetActivated': 'Font set activated for the preview.',
    'ex.zipShort': 'ZIP (all formats)',
    'ex.statusPng': 'Rendering PNG…',
    'ex.statusFormat': 'Rendering {format} ({index}/{total})…',
    'ex.statusZip': 'Building the ZIP package…',
    'msg.pngExported': 'PNG exported: {name}',
    'msg.pngFailed': 'PNG export failed: {error}',
    'msg.pickFormat': 'Please select at least one format.',
    'msg.zipCreated': 'ZIP archive created: {name}',
    'msg.zipFailed': 'ZIP export failed: {error}',
    'msg.configSavedWithImage': 'Configuration saved, background included.',
    'msg.bgNotAnImage': 'That file is not an image.',
    'msg.configSaved': 'Configuration saved.',
    'msg.invalidJson': 'Invalid JSON file.',
    'msg.setupLoaded': 'Setup loaded from {name}.',
    'msg.setupFailed': 'The setup could not be applied.',
    'msg.resetDone': 'Reset to defaults.',
    'msg.storageFull': 'Browser storage is full. Please export a JSON backup.',
    'msg.templateRemoved': '"{name}" removed from the catalogue. The file is still there.',
    'msg.templateLast': 'The last template cannot be removed.',
    'msg.templatesRestoredOne': '1 template restored.',
    'msg.templatesRestored': '{count} templates restored.',
    'msg.notAnObject': 'The file does not contain a configuration object.',
    'msg.foreignFile': 'The file belongs to "{id}", not to the Brand Kit Generator.',
    'msg.noIdentifier': 'No Brand Kit setup: the file carries no Brand Kit Generator identifier.',
    'msg.newerVersion': 'Saved with version {version}, this app is {current}. Anything it does not know will be ignored.',
    'msg.noVersion': 'The setup carries no version. It is read as best it can be.',

    // -- Areas named in the import dialog ------------------------------------
    'area.company': 'Company',
    'area.products': 'Products',
    'area.colorSets': 'Colour sets',
    'area.fontSets': 'Font sets',
    'area.typography': 'Typography',
    'area.content': 'Post content',
    'area.selection': 'Selection',
    'area.background': 'Background image',
    'area.hiddenTemplates': 'Removed templates',

    // -- Creation area -----------------------------------------------------------
    'wf.selection': 'Selection',
    'wf.product': 'Product',
    'wf.template': 'Template',
    'wf.fontset': 'Font set',
    'wf.colorset': 'Colour set',
    'wf.edit': 'Edit →',
    'wf.content': 'Content for this post',
    'wf.notUsed': 'not used in the template',
    'wf.notIn': 'not in the template',
    'wf.phTitle': 'Episode title / main headline...',
    'wf.phSubtitle': 'e.g. Special guest: Alexander Vance',
    'wf.phDescription': 'Short summary, quote context or a note...',
    'wf.phTag': 'e.g. PODCAST #42',
    'wf.phTag2': 'e.g. UPDATE',
    'wf.colourOf': 'Colour: {role}',
    'wf.tagNote': 'Leaving a tag empty hides it. The colours come from the assignment in the colour set.',
    'wf.tagNoteLink': 'Change it there →',
    'wf.characters': '{count} characters',

    // -- Export area -------------------------------------------------------------
    'ex.formats': 'Formats for the ZIP set',
    'ex.current': 'Current combination',
    'ex.png': 'Download the current view as PNG',
    'ex.zip': 'Export all formats as a ZIP package',
    'ex.notes': 'Notes',
    'ex.note1': 'Without a background image the PNGs are transparent and go into any video editor, streaming program or image editor as the topmost layer over footage or stills. With one they come out ready to upload.',
    'ex.note2': 'The export is verified for Chrome and Edge. In Safari it is not reliable.',

    // -- Colour and font set areas -----------------------------------------------
    'cs.heading': 'Colour sets',
    'cs.name': 'Colour set name',
    'cs.phName': 'e.g. Neon Purple',
    'cs.values': 'Colour values',
    'cs.assignment': 'Assignment',
    'fs.heading': 'Font sets',
    'fs.name': 'Font set name',
    'fs.phName': 'e.g. Broadcast',
    'fs.variations': 'Variations',
    'fs.removeVariation': 'Remove this variation',
    'fs.weightOnly': 'Weight only – this family has no further axes.',
    'fs.note': 'A variation says which typeface and how it is tuned. Weight and size are not part of it: they are hierarchy. The weight sits next to each placeholder in the',
    'fs.noteLink': 'Template area',
    'fs.noteAfter': ', the size stays in the CSS of the template.',
    'common.showInPreview': 'Show in preview',
    'common.activeInPreview': 'Active in preview',

    // -- Brand areas -------------------------------------------------------------
    'pr.heading': 'Products',
    'pr.edit': 'Edit product',
    'pr.title': 'Title',
    'pr.slogan': 'Slogan',
    'pr.logo': 'Logo',
    'pr.phTitle': 'e.g. Pod Rush',
    'pr.phSlogan': 'e.g. The weekly gaming talk',
    'pr.changeLogo': 'Change logo',
    'co.heading': 'Company',
    'co.name': 'Name',
    'co.slogan': 'Slogan',
    'co.copyright': 'Copyright',
    'co.logo': 'Logo',

    // -- Template area -----------------------------------------------------------
    'tp.heading': 'Template',
    'tp.removeTitle': 'Take out of the catalogue. The file stays and can be brought back.',
    'tp.removeArmed': 'Click again to take it out of the catalogue',
    'tp.removed': 'Removed: {names}',
    'tp.removedNote': 'The files are still under src/templates/ and listed in the manifest.',
    'tp.placeholders': 'Placeholders in this template',
    'tp.unknownSlots': 'Unknown placeholders (a typo?): {list}',
    'tp.typography': 'Typography',
    'tp.typoNote': 'Which variation and which weight each placeholder uses. The size stays in the CSS of the template – it is tuned per element and per format.',
    'tp.colPlaceholder': 'Placeholder',
    'tp.colVariation': 'Variation',
    'tp.colWeight': 'Weight',
    'tp.supports': '{font} supports {min}-{max}',
    'tp.howBuilt': 'How a template is built',
    'tp.how1': 'An ordinary HTML page under <code class="text-ui-300">src/templates/</code>. The entire design lives in its <code class="text-ui-300">&lt;style&gt;</code>.',
    'tp.how2': 'The overlay sits in an element with <code class="text-ui-300">class="frame"</code>. The app sets its size and <code class="text-ui-300">data-format</code> (<code>1:1</code>, <code>4:5</code>, <code>9:16</code>, <code>16:9</code>).',
    'tp.how3': 'Text and logos: <code class="text-ui-300">data-slot="title"</code> and so on. Empty text fields are hidden. <code class="text-ui-300">data-show-if="company.name"</code> hides an element when the value is missing.',
    'tp.how4': 'Colours from the colour set: <code class="text-ui-300">var(--color-accent)</code> and so on. Fonts come per placeholder as <code class="text-ui-300">var(--font-title)</code>, <code class="text-ui-300">--font-title-weight</code> and <code class="text-ui-300">--font-title-axes</code> &ndash; always with a fallback, and never inside the <code class="text-ui-300">font:</code> shorthand.',
    'tp.how5': 'New template: create the file and list it in <code class="text-ui-300">templates/manifest.json</code>. Name and description come from <code class="text-ui-300">&lt;title&gt;</code> and <code class="text-ui-300">&lt;meta name="description"&gt;</code>.',

    // -- Template area, continued ------------------------------------------------
    'tp.noTextSlots': 'This template declares no text placeholders.',

    // -- Recurring words -----------------------------------------------------
    'common.sure': 'Sure?',
    'common.reset': 'Reset',
    'common.delete': 'Delete',
    'common.remove': 'Remove',
    'common.restore': 'Restore',
    'common.duplicate': 'Duplicate',
    'common.new': 'New',
    'common.defaultLocked': 'The default entry cannot be renamed or deleted - it is the fallback for every dropdown.'
  };

  const de = {
    'app.by': 'von',
    'app.version': 'Version {version}',

    'header.load': 'Laden',
    'header.loadTitle': 'Eine gesicherte Einrichtung aus einer JSON-Datei laden',
    'header.save': 'Speichern',
    'header.saveTitle': 'Die aktuelle Einrichtung als JSON-Datei sichern',
    'header.themeToLight': 'Zur hellen Oberfläche wechseln',
    'header.themeToDark': 'Zur dunklen Oberfläche wechseln',
    'header.langTitle': 'Sprache der Oberfläche wechseln',
    'header.reset': 'Auf Werkseinstellung zurücksetzen',
    'header.resetArmed': 'Noch einmal klicken, um alles zu verwerfen',
    'header.resetConfirm': 'Alles verwerfen?',

    'preview.bgCheckerDark': 'Dunkles Transparenzmuster',
    'preview.bgCheckerLight': 'Helles Transparenzmuster',
    'preview.bgBlack': 'Schwarzer Hintergrund',
    'preview.bgWhite': 'Weißer Hintergrund',
    'preview.bgUpload': 'Hintergrundbild hochladen (wird mitexportiert)',
    'preview.bgExpectedTitle': 'Diese Einrichtung wurde ohne Hintergrundbild gesichert. Wähle „{name}“, der Ausschnitt sitzt dann schon.',
    'preview.bgFraming': 'Ausschnitt: ziehen zum Verschieben, scrollen zum Zoomen, Doppelklick oder Klick hier setzt zurück',
    'preview.bgRemove': 'Hintergrundbild entfernen',
    'preview.frameTitle': 'Template-Vorschau',
    'preview.exportFrameTitle': 'Export',
    'preview.templateFailed': 'Das Template konnte nicht gerendert werden',

    'footer.nav': 'Über diese Anwendung',
    'footer.project': 'Projektseite',
    'footer.projectTitle': 'Quellcode und Fehlermeldungen auf GitHub',
    'footer.manual': 'Handbuch',
    'footer.manualTitle': 'Das Handbuch als PDF',
    'footer.licence': 'Lizenz',
    'footer.licenceTitle': 'MIT. Die mitgelieferten Schriften haben eigene Lizenzen in fonts/LICENSES.txt',
    'footer.imprint': 'Impressum',
    'footer.imprintTitle': 'Rechtliche Angaben',

    'import.heading': 'Einrichtung laden?',
    'import.warningBefore': 'Dies ',
    'import.warningStrong': 'ersetzt die aktuelle Einrichtung',
    'import.warningAfter': ' — Unternehmen, Produkte, Farbsets, Font-Sets und die Texte des Posts. Was nicht als JSON-Datei gesichert ist, ist danach weg.',
    'import.version': 'Version',
    'import.contains': 'Enthält',
    'import.containsNothing': 'nichts, was diese Anwendung liest',
    'bgswap.heading': 'Ein anderes Bild?',
    'bgswap.explain': 'Die geladene Einrichtung wartet auf {expected}, und der Ausschnitt, den sie mitgebracht hat, war an diesem Bild gemessen. Mit {picked} geht er verloren - jedes Template und jedes Format steht dann wieder auf dem vollen Bild.',
    'bgswap.expected': 'Erwartet',
    'bgswap.picked': 'Gewählt',
    'bgswap.confirm': 'Verwenden, Ausschnitt verwerfen',
    'save.heading': 'Hintergrundbild mitsichern?',
    'save.explain': 'Alles andere in einer Einrichtung ist Text und wiegt fast nichts. Ein Bild nicht, deshalb die Frage.',
    'save.withImage': 'Mit Bild',
    'save.withImageHint': 'Eine vollständige Datei. Größer, und per Mail unhandlich.',
    'save.withoutImage': 'Ohne Bild',
    'save.withoutImageHint': 'Kleine Datei. Sie behält den Ausschnitt und nennt das Bild, das du nach dem Laden erneut wählst.',
    'import.cancel': 'Abbrechen',
    'import.confirm': 'Einrichtung ersetzen',
    'import.unknownVersion': 'unbekannt',

    'menu.group.post': 'Post',
    'menu.group.design': 'Design',
    'menu.group.brand': 'Marke',
    'menu.item.workflow': 'Erstellen',
    'menu.item.export': 'Export',
    'menu.item.template': 'Template',
    'menu.item.fontset': 'Font-Set',
    'menu.item.colorset': 'Farbset',
    'menu.item.products': 'Produkte',
    'menu.item.company': 'Unternehmen',

    'format.1:1': '1:1 Quadratisch',
    'format.9:16': '9:16 Hochformat',
    'format.16:9': '16:9 Querformat',
    'format.4:5': '4:5 Portrait',

    'role.background': 'Hintergrund',
    'role.background.hint': 'Flächen, etwa der Balken',
    'role.accent': 'Akzent',
    'role.accent.hint': 'Hervorhebungen, etwa Produktname oder Tag',
    'role.secondary': 'Sekundär',
    'role.secondary.hint': 'Zweite Akzentfarbe, etwa die Mitte eines Verlaufs',
    'role.border': 'Rahmen',
    'role.border.hint': 'Kanten und Linien',
    'role.text': 'Text',
    'role.text.hint': 'Fließtext, etwa der Titel',
    'role.subtext': 'Subtext',
    'role.subtext.hint': 'Zweite Textebene, etwa der Untertitel',
    'role.description': 'Beschreibung',
    'role.description.hint': 'Kleinste Textebene',
    'assign.tag': 'Tag 1',
    'assign.tag2': 'Tag 2',

    'slot.title': 'Titel',
    'slot.subtitle': 'Untertitel',
    'slot.description': 'Beschreibung',
    'slot.tag': 'Tag 1',
    'slot.tag2': 'Tag 2',
    'slot.product.title': 'Produkttitel',
    'slot.product.slogan': 'Produktslogan',
    'slot.product.logo': 'Produktlogo',
    'slot.company.name': 'Firmenname',
    'slot.company.slogan': 'Firmenslogan',
    'slot.company.copyright': 'Firmen-Copyright',
    'slot.company.logo': 'Firmenlogo',
    'slotSource.creation': 'Erstellen',
    'slotSource.product': 'Produkt',
    'slotSource.company': 'Unternehmen',

    'axis.CASL': 'Lässigkeit',
    'axis.CASL.hint': 'technisch bis handschriftlich',
    'axis.MONO': 'Dicktengleichheit',
    'axis.MONO.hint': 'proportional bis feste Breite',
    'axis.slnt': 'Neigung',
    'axis.slnt.hint': 'aufrecht bis geneigt',
    'axis.CRSV': 'Kursivformen',
    'axis.CRSV.hint': '0,5 folgt der Neigung',
    'axis.wdth': 'Breite',
    'axis.wdth.hint': 'schmal bis breit',
    'axis.SOFT': 'Weichheit',
    'axis.SOFT.hint': 'scharfe bis runde Kanten',
    'axis.WONK': 'Eigenwilligkeit',
    'axis.WONK.hint': 'schaltet auf die eigenwilligen Buchstabenformen um',

    'font.Recursive.note': 'Hausschrift von WASDCAT. Fünf Achsen, die anpassungsfähigste Familie hier.',
    'font.Orbitron.note': 'Gaming-Displayschrift. Breit, geometrisch, technisch.',
    'font.Archivo.note': 'Grotesk fürs Grobe, mit einstellbarer Breite.',
    'font.Inter.note': 'Neutrale Schrift für Inhalte. Auch klein noch gut lesbar.',
    'font.Space Grotesk.note': 'Technische Grotesk mit Eigenart.',
    'font.Fraunces.note': 'Redaktionelle Serifenschrift mit weichen und eigenwilligen Achsen.',
    'font.Open Sans.note': 'Die Oberflächenschrift dieser Anwendung. Ruhig und verlässlich.',

    'msg.productCreated': 'Neues Produkt angelegt.',
    'msg.productDuplicated': 'Produkt dupliziert.',
    'msg.productDeleted': 'Produkt gelöscht.',
    'msg.svgRejected': 'Ungültige oder unsichere SVG-Datei.',
    'msg.colorSetDuplicated': 'Farbset dupliziert.',
    'msg.colorSetDeleted': 'Farbset gelöscht.',
    'msg.colorSetNoFactory': 'Dieses Farbset hat keinen Werkszustand.',
    'msg.setReset': '"{name}" auf den Werkszustand zurückgesetzt.',
    'msg.colorSetActivated': 'Farbset für die Vorschau aktiviert.',
    'msg.fontSetDuplicated': 'Font-Set dupliziert.',
    'msg.fontSetDeleted': 'Font-Set gelöscht.',
    'msg.fontSetNoFactory': 'Dieses Font-Set hat keinen Werkszustand.',
    'msg.fontSetActivated': 'Font-Set für die Vorschau aktiviert.',
    'ex.zipShort': 'ZIP (alle Formate)',
    'ex.statusPng': 'PNG wird gerendert…',
    'ex.statusFormat': '{format} wird gerendert ({index}/{total})…',
    'ex.statusZip': 'ZIP-Paket wird gepackt…',
    'msg.pngExported': 'PNG exportiert: {name}',
    'msg.pngFailed': 'PNG-Export fehlgeschlagen: {error}',
    'msg.pickFormat': 'Bitte mindestens ein Format auswählen.',
    'msg.zipCreated': 'ZIP-Archiv erstellt: {name}',
    'msg.zipFailed': 'ZIP-Export fehlgeschlagen: {error}',
    'msg.configSavedWithImage': 'Einrichtung gesichert, Hintergrundbild eingeschlossen.',
    'msg.bgNotAnImage': 'Diese Datei ist kein Bild.',
    'msg.configSaved': 'Einrichtung gesichert.',
    'msg.invalidJson': 'Ungültige JSON-Datei.',
    'msg.setupLoaded': 'Einrichtung aus {name} geladen.',
    'msg.setupFailed': 'Die Einrichtung konnte nicht übernommen werden.',
    'msg.resetDone': 'Auf Werkseinstellung zurückgesetzt.',
    'msg.storageFull': 'Der Browserspeicher ist voll. Bitte eine JSON-Sicherung anlegen.',
    'msg.templateRemoved': '"{name}" aus dem Katalog genommen. Die Datei bleibt erhalten.',
    'msg.templateLast': 'Das letzte Template lässt sich nicht entfernen.',
    'msg.templatesRestoredOne': '1 Template wiederhergestellt.',
    'msg.templatesRestored': '{count} Templates wiederhergestellt.',
    'msg.notAnObject': 'Die Datei enthält kein Konfigurationsobjekt.',
    'msg.foreignFile': 'Die Datei gehört zu "{id}", nicht zum Brand Kit Generator.',
    'msg.noIdentifier': 'Keine Brand-Kit-Einrichtung: Der Datei fehlt die Kennung des Brand Kit Generators.',
    'msg.newerVersion': 'Gesichert mit Version {version}, diese Anwendung ist {current}. Was sie nicht kennt, wird übergangen.',
    'msg.noVersion': 'Die Einrichtung trägt keine Version. Sie wird so gut wie möglich gelesen.',

    'area.company': 'Unternehmen',
    'area.products': 'Produkte',
    'area.colorSets': 'Farbsets',
    'area.fontSets': 'Font-Sets',
    'area.typography': 'Typografie',
    'area.content': 'Post-Inhalt',
    'area.selection': 'Auswahl',
    'area.background': 'Hintergrundbild',
    'area.hiddenTemplates': 'Entfernte Templates',

    // -- Creation area -----------------------------------------------------------
    'wf.selection': 'Auswahl',
    'wf.product': 'Produkt',
    'wf.template': 'Template',
    'wf.fontset': 'Font-Set',
    'wf.colorset': 'Farbset',
    'wf.edit': 'Bearbeiten →',
    'wf.content': 'Inhalt dieses Posts',
    'wf.notUsed': 'im Template nicht verwendet',
    'wf.notIn': 'nicht im Template',
    'wf.phTitle': 'Episodentitel / Hauptaussage ...',
    'wf.phSubtitle': 'z. B. Zu Gast: Alexander Vance',
    'wf.phDescription': 'Kurze Zusammenfassung, Einordnung oder Notiz ...',
    'wf.phTag': 'z. B. PODCAST #42',
    'wf.phTag2': 'z. B. UPDATE',
    'wf.colourOf': 'Farbe: {role}',
    'wf.tagNote': 'Ein leeres Tag wird ausgeblendet. Die Farben stammen aus der Zuweisung im Farbset.',
    'wf.tagNoteLink': 'Dort ändern →',
    'wf.characters': '{count} Zeichen',

    // -- Export area -------------------------------------------------------------
    'ex.formats': 'Formate für das ZIP-Paket',
    'ex.current': 'Aktuelle Kombination',
    'ex.png': 'Aktuelle Ansicht als PNG herunterladen',
    'ex.zip': 'Alle Formate als ZIP-Paket exportieren',
    'ex.notes': 'Hinweise',
    'ex.note1': 'Ohne Hintergrundbild sind die PNGs transparent und lassen sich in einem Videoschnittprogramm, einer Streaming-Software oder einer Bildbearbeitung als oberste Ebene über Material legen. Mit Hintergrundbild kommen sie uploadfertig heraus.',
    'ex.note2': 'Der Export ist für Chrome und Edge geprüft. In Safari ist er nicht zuverlässig.',

    // -- Colour and font set areas -----------------------------------------------
    'cs.heading': 'Farbsets',
    'cs.name': 'Name des Farbsets',
    'cs.phName': 'z. B. Neon Purple',
    'cs.values': 'Farbwerte',
    'cs.assignment': 'Zuweisung',
    'fs.heading': 'Font-Sets',
    'fs.name': 'Name des Font-Sets',
    'fs.phName': 'z. B. Broadcast',
    'fs.variations': 'Variationen',
    'fs.removeVariation': 'Diese Variation entfernen',
    'fs.weightOnly': 'Nur Strichstärke – diese Familie hat keine weiteren Achsen.',
    'fs.note': 'Eine Variation sagt, welche Schrift und wie eingestellt. Strichstärke und Größe gehören nicht dazu: sie sind Hierarchie. Die Strichstärke steht neben jedem Platzhalter im',
    'fs.noteLink': 'Template-Bereich',
    'fs.noteAfter': ', die Größe bleibt im CSS des Templates.',
    'common.showInPreview': 'In der Vorschau zeigen',
    'common.activeInPreview': 'In der Vorschau aktiv',

    // -- Brand areas -------------------------------------------------------------
    'pr.heading': 'Produkte',
    'pr.edit': 'Produkt bearbeiten',
    'pr.title': 'Titel',
    'pr.slogan': 'Slogan',
    'pr.logo': 'Logo',
    'pr.phTitle': 'z. B. Pod Rush',
    'pr.phSlogan': 'z. B. Der wöchentliche Gaming-Talk',
    'pr.changeLogo': 'Logo ändern',
    'co.heading': 'Unternehmen',
    'co.name': 'Name',
    'co.slogan': 'Slogan',
    'co.copyright': 'Copyright',
    'co.logo': 'Logo',

    // -- Template area -----------------------------------------------------------
    'tp.heading': 'Template',
    'tp.removeTitle': 'Aus dem Katalog nehmen. Die Datei bleibt erhalten und lässt sich zurückholen.',
    'tp.removeArmed': 'Noch einmal klicken, um es aus dem Katalog zu nehmen',
    'tp.removed': 'Entfernt: {names}',
    'tp.removedNote': 'Die Dateien liegen weiterhin unter src/templates/ und stehen im Manifest.',
    'tp.placeholders': 'Platzhalter in diesem Template',
    'tp.unknownSlots': 'Unbekannte Platzhalter (Tippfehler?): {list}',
    'tp.typography': 'Typografie',
    'tp.typoNote': 'Welche Variation und welche Strichstärke jeder Platzhalter benutzt. Die Größe bleibt im CSS des Templates – sie ist je Element und je Format abgestimmt.',
    'tp.colPlaceholder': 'Platzhalter',
    'tp.colVariation': 'Variation',
    'tp.colWeight': 'Strichstärke',
    'tp.supports': '{font} unterstützt {min}-{max}',
    'tp.howBuilt': 'Wie ein Template aufgebaut ist',
    'tp.how1': 'Eine gewöhnliche HTML-Seite unter <code class="text-ui-300">src/templates/</code>. Das gesamte Design steckt in ihrem <code class="text-ui-300">&lt;style&gt;</code>.',
    'tp.how2': 'Das Overlay liegt in einem Element mit <code class="text-ui-300">class="frame"</code>. Die App setzt dessen Größe und <code class="text-ui-300">data-format</code> (<code>1:1</code>, <code>4:5</code>, <code>9:16</code>, <code>16:9</code>).',
    'tp.how3': 'Text und Logos: <code class="text-ui-300">data-slot="title"</code> und so weiter. Leere Textfelder werden ausgeblendet. <code class="text-ui-300">data-show-if="company.name"</code> blendet ein Element aus, wenn der Wert fehlt.',
    'tp.how4': 'Farben aus dem Farbset: <code class="text-ui-300">var(--color-accent)</code> und so weiter. Schriften kommen je Platzhalter als <code class="text-ui-300">var(--font-title)</code>, <code class="text-ui-300">--font-title-weight</code> und <code class="text-ui-300">--font-title-axes</code> &ndash; immer mit Fallback und nie in der Kurzform <code class="text-ui-300">font:</code>.',
    'tp.how5': 'Neues Template: Datei anlegen und in <code class="text-ui-300">templates/manifest.json</code> eintragen. Name und Beschreibung stammen aus <code class="text-ui-300">&lt;title&gt;</code> und <code class="text-ui-300">&lt;meta name="description"&gt;</code>.',

    // -- Template area, continued ------------------------------------------------
    'tp.noTextSlots': 'Dieses Template deklariert keine Textplatzhalter.',

    'common.sure': 'Sicher?',
    'common.reset': 'Zurücksetzen',
    'common.delete': 'Löschen',
    'common.remove': 'Entfernen',
    'common.restore': 'Wiederherstellen',
    'common.duplicate': 'Duplizieren',
    'common.new': 'Neu',
    'common.defaultLocked': 'Der Standardeintrag kann weder umbenannt noch gelöscht werden - er ist die Rückfalloption jeder Auswahl.'
  };

  const STRINGS = { en, de };

  /** The language the browser reports, if we have it; English otherwise. */
  function detect() {
    const candidates = [];
    if (typeof navigator !== 'undefined') {
      if (Array.isArray(navigator.languages)) candidates.push(...navigator.languages);
      if (navigator.language) candidates.push(navigator.language);
    }
    for (const tag of candidates) {
      const base = String(tag).toLowerCase().split('-')[0];
      if (LANGS.includes(base)) return base;
    }
    return FALLBACK;
  }

  /**
   * Looks a key up in `lang`, falls back to English, and as a last resort
   * returns the key itself - visible, so a missing string is noticed rather
   * than silently leaving a gap. {placeholders} are filled from `vars`.
   */
  function translate(lang, key, vars) {
    const table = STRINGS[lang] || STRINGS[FALLBACK];
    let value = table[key];
    if (value === undefined) value = STRINGS[FALLBACK][key];
    if (value === undefined) return key;
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, name) =>
      (vars[name] === undefined ? match : String(vars[name])));
  }

  window.BKG_I18N = { LANGS, FALLBACK, STRINGS, detect, translate };
})();
