# Fonts and typography

## The fonts that ship

Seven families live in the project. Nothing is fetched from a font service — that keeps the export predictable and means an overlay still looks the same after a vendor updates a family.

| Family | Picked for | Axes besides weight |
| --- | --- | --- |
| **Recursive** | WASDCAT corporate typeface | `CASL`, `MONO`, `slnt`, `CRSV` |
| **Orbitron** | Gaming display | – |
| **Archivo** | Workhorse with an adjustable width | `wdth` 62–125 |
| **Inter** | Neutral content | – |
| **Space Grotesk** | Technical grotesque | – |
| **Fraunces** | Editorial serif | `SOFT`, `WONK` |
| **Open Sans** | The interface font of this application | `wdth` 75–100 |

All seven are **variable fonts**: one file holding a whole design space rather than separate cuts.

## Variation and font set

A **variation** answers *which typeface, tuned how*: a family plus values for its axes. A **font set** is a named group of such variations and works exactly like a colour set — several of them, switchable, saved with the setup.

One font set ships, named *Default*, holding a single variation on Open Sans. Nothing beyond that is prescribed: the typography of a brand is built here, it is not shipped with the application.

### Setting axes

Every axis of the chosen family gets a slider. With Recursive, for instance:

- **CASL** fades from technical to handwritten
- **MONO** from proportional to fixed width
- **slnt** slants the face

Change the family of a variation and axes the new one does not know are dropped, while the rest are brought into their valid range.

### Why no weight

A variation deliberately carries **neither weight nor size**. Both are hierarchy, and hierarchy belongs to the element, not to the font:

| What | Where it is set |
| --- | --- |
| Family and axis values | *Font set* area, per variation |
| Which variation and weight a placeholder uses | *Template* area, per placeholder |
| Size, including the steps per format | CSS of the template |

A global weight would either flatten the hierarchy a template builds up, or fight it.

> [!NOTE] Values are adjusted, not rejected
> Enter a weight the chosen family cannot reach and it is brought to the nearest valid one. Open Sans stops at 800 — an entered 900 becomes 800.

## Managing sets

**Duplicate** copies the font set being edited along with its variations. That is what keeps the placeholder mapping working across sets.

Every font set keeps a variation named *Default* — a duplicated one too. So a placeholder mapping never points at nothing.

Switch font sets and, if the new one does not know a mapped variation, the affected placeholder falls back to *Default* instead of pointing into the void.

## Adding a font

This is a change to the project, not a step in the interface:

1. Put the `.woff2` file into `src/fonts/`
2. Add an `@font-face` block to `src/fonts/fonts.css`
3. Add an entry to `src/fonts.js`, naming under `axes` every axis that should be adjustable
4. Append the license text to `src/fonts/LICENSES.txt`

Step 4 is not a formality: the bundled fonts are under the SIL Open Font License, which requires the license to travel with them.
