# Templates

A template is the layout of an overlay. Technically it is an ordinary HTML file under `src/templates/` whose entire design sits in its CSS. The application fills in colours, fonts and text — the arrangement is the template's business.

Something practical follows from that: anyone who knows HTML and CSS can build a template without touching a line of program code. And every template file can be opened on its own in a browser; it then shows sample values and looks just as it does in the application.

## The templates that ship

| Template | Layout |
| --- | --- |
| **Lower Third** | The classic full-width bar along the bottom: product logo, brand line with up to two tags, title and copyright line. For video and stream. |
| **Example 1 — Corner Bug** | Reduced to a station bug in the top right: company logo, company name, slogan underneath. Uses no post content and stays readable over any material. |
| **Example 2 — Angled Bar** | A bar at the bottom left, only as wide as it needs to be, with the right edge cut at an angle and an accent strip down its left side. |
| **Example 3 — Title Card** | A full-frame card for feed posts: tags, a large title, subtitle and description over a scrim that fades up from the bottom, with product logo and copyright on the base line. |

The three examples are there to be looked at. They show three very different ways of using the same mechanics.

## Placeholders

The *Placeholders in this template* block lists all twelve placeholders there are. The highlighted ones are used by the chosen template.

| Placeholder | Comes from |
| --- | --- |
| `title`, `subtitle`, `description`, `tag`, `tag2` | *Creation* area |
| `product.title`, `product.slogan`, `product.logo` | *Products* area |
| `company.name`, `company.slogan`, `company.copyright`, `company.logo` | *Company* area |

A warning about *unknown placeholders* means the template file uses a name the application does not know — usually a typo in the file.

## Mapping the typography

Below that, every placeholder the template uses gets a row with two fields:

- **Variation** — which font variation from the chosen font set
- **Weight** — which stroke weight. The range depends on the font family; the field names the one in use.

The font size deliberately is **not** here. It stays in the template, because there it is tuned element by element and format by format. In the lower third the title grows by a factor of 1.41 from landscape to portrait while the brand line only grows by 1.20 — so the title dominates more in the narrow format. A single number in the application could not express that.

> [!NOTE] The division of labour
> The **family and its axes** are set in the font set. Which **variation and weight** a placeholder uses is decided here. The **size** stays in the template. Each layer decides what it is best placed to judge.

## Taking a template out of the catalogue

Under the selector sit the file path and, beside it, **Remove**. The button asks once.

> [!IMPORTANT] Removing deletes no file
> A template is a file on disk, and a browser is not allowed to delete files. **Remove** takes the entry out of the catalogue and remembers that. The file stays under `src/templates/` and remains listed in the manifest.

As soon as something is removed, a row appears below listing the removed templates with a **Restore** button that brings them all back at once. *Reset to factory defaults* in the header restores the full catalogue too.

The last remaining template cannot be removed — without a template there would be nothing to render.

## Adding your own template

For anyone who wants to build one:

1. Create an HTML file in `src/templates/`. Easiest is to copy one of the shipped ones and rework it.
2. Add the file name to `src/templates/manifest.json` under `templates`.
3. Reload the page. The template is in the catalogue.

Name, description and category are read by the application from the file's `<title>` and `<meta>` tags — they do not belong in the manifest.

No program code needs touching.
