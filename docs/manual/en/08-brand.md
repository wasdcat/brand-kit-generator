# Brand: products and company

These two areas hold what rarely changes. Set up once, you will barely touch them again.

## Company

Four details that appear in nearly every template:

| Field | Appears as |
| --- | --- |
| **Name** | `company.name` |
| **Slogan** | `company.slogan` |
| **Copyright** | `company.copyright` |
| **Logo** | `company.logo` |

The copyright line is usually the smallest type in the overlay — a `© Your Company` in a corner. It is a signature, not a legal department.

## Products

A product is anything with an identity of its own: a show, a game, a series, a format. Each gets a title, a slogan and a logo.

**New** creates one, **Duplicate** copies the current one — handy for a series that differs only in name.

The *Default* entry can, as everywhere, be neither renamed nor deleted; it is the fallback when a product is removed.

> [!TIP] The product title ends up in the file name
> On export the product title becomes part of the file name. A telling title saves you sorting your downloads folder later.

## Uploading logos

Both areas take a logo through **Change logo**. Two things happen automatically.

### Raster images are scaled down

PNG, JPEG and WebP are reduced to at most 512 × 512 pixels, keeping their aspect ratio. Smaller images are left alone.

The reason is browser storage. It typically holds around 5 MB, and one high-resolution logo embedded as image data can eat several of those on its own. Without scaling, storage would be full after two or three logos — and the whole setup could no longer be saved.

512 pixels is plenty: even in the largest format a logo is rarely displayed above 150 pixels.

### SVG files are cleaned

An SVG file is executable code. It can carry scripts, event handlers and references to the outside. Uploaded SVGs are therefore inspected and stripped of everything that is not part of the drawing. A file that cannot sensibly be cleaned is rejected with a message.

For logos SVG is the better choice: scalable to any size at a tiny file size.

> [!WARNING] Storage full
> If the application reports *Browser storage is full*, your setup was **not** saved. Back it up immediately through *Save setup* and then remove products you no longer need, or particularly large logos.

## Where the values end up

Whether and where a detail appears is entirely the template's decision. *Example 1 — Corner Bug* uses only the company details, *Example 2 — Angled Bar* only the product. Which placeholders a template fills is shown in the *Template* area.
