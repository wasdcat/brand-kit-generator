# Theme `wasdcat`

Das Corporate-Theme von WASDCAT Games für **markpublish** (Typst-basiert).
Aufgebaut auf der Architektur des offiziellen markpublish Default-Themes.

---

## Verwendung

In der `markpublish.yaml`:

```yaml
document:
  title: "Build-Pipeline und Release-Prozess"
  subtitle: "Verbindliche Arbeitsanweisung für alle Projekte des Studios"
  author: "Frank Winter"
  version: "1.0"
  status: "Freigegeben"
  date: "auto"
  copyright: "(C) 2026 WASDCAT Games. All rights reserved."
  classification: "Intern"              # optional: Kennzeichnung oben auf dem Deckblatt
  cover: true
  document_toc: "full"

theme: "wasdcat"
templates_dir: "E:/CI/wasdcat-cd/markpublish/templates"
```

Dokument als PDF kompilieren:
```bash
markpublish build --target pdf
```

---

## Designmerkmale

### 1. Deckblatt (Dark Cover)
- **Kompaktes Signet oben**: 28-mm-Logo und zweizeiliger Studioname auf gleicher horizontaler Y-Mittellinie. Der Tagline-Subtext (*Independent Game Studio*) schließt über berechnetes Tracking bündig mit der Breite des Studionamens ab.
- **Prägnanter Titelbereich**: Platzierung in der optischen Mitte. Titel und Untertitel werden durch eine kräftige, symmetrisch zentrierte Signallinie (3 pt, Rostorange, 11 mm Abstand) getrennt.
- **Metadaten-Tabelle**: Horizontale Spaltenanordnung (`VERSION`, `AUTOR`, `STATUS`, `DATUM`) mit dezenten Trennstrichen. Nicht gesetzte oder leere Felder werden automatisch ausgeblendet.
- **Fußbalken**: Durchgehender Anthrazitbalken mit zentrierter Copyright-Angabe `(C) 2026 WASDCAT Games. All rights reserved.`.

### 2. Schrift (Recursive Variable Font)
- Vollständig über **Recursive** als Variable Font realisiert (`pdf/fonts/recursive_variable.ttf`).
- **Keine Causal-Formatierung**: `CASL: 0.0` durchgängig aktiv (Linear Sans).
- Echter Monospace-Satz für Code (`raw`) über `MONO: 1.0`.

### 3. Farbkonzept (Corporate Colors)
- **Blau ist Struktur**: Corporate-Blau (`#1d4a7a`) für Linien, Tabellenkopf und Listenmarken; sanfte Blautönung (`#eef3f8`) für Codeblöcke und Tabellenkopf-Hintergrund.
- **Orange ist Signal**: Rostorange (`#af521f` auf Weiß bzw. `#e8813a` auf dem Cover) für Gliederungsnummern, Links und Checkboxen.
- **Lesekontrast**: Tiefes Ink-Strong (`#0f1c2b`) für Überschriften und Ink (`#16202b`) für Fließtext.

---

## Aufbau des Themes

- **`pdf/`**: Typst-Layoutvorlagen, Styling und Dokumentlogik
- **`pdf/fonts/`**: Hausschrift und Schriftlizenzen
- **`pdf/assets/`**: Studio-Logos, Grafiken und UI-Icons

---

## Lizenz

- **Schrift**: Recursive steht unter der SIL Open Font License 1.1 (`pdf/fonts/ofl.txt`).
- **Icons**: GitHub Octicons unter MIT-Lizenz.
- **Branding**: Logo, Farben und Layout © 2026 WASDCAT Games.
