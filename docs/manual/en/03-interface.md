# The interface

The window has four zones: the header, the sidebar on the left, the preview on the right and the export bar at the bottom.

## Header

Five controls sit in the top right:

| Control | Effect |
| --- | --- |
| **Load** | Load a saved setup from a file |
| **Save** | Download the current setup as a JSON file |
| **Sun / moon** | Switch between the dark and light interface |
| **DE / EN** | Switch the interface language |
| **Circular arrow** | Reset everything to factory defaults |

The language button shows the language it would switch to, not the one you are in — the label is the action, like every other button there.

> [!CAUTION] Resetting discards everything
> The circular arrow deletes your entire setup: company, products, colour sets, font sets and text. It asks once — the first click arms it, a second within four seconds carries it out. Any other click disarms it again.

Switching the interface between light and dark affects the application only. It has no bearing on the overlay or the export.

## Sidebar

A narrow rail on the far left holds seven symbols in three groups:

**Post** — what changes with every piece

- *Creation*: choosing the blocks and the text of the post
- *Export*: format selection for the ZIP archive and the export buttons

**Design** — how it looks

- *Template*: pick the layout, see the placeholders, map the typography
- *Font set*: create font variations and set their axes
- *Colour set*: colour values and their assignment

**Brand** — what rarely changes

- *Products*: products with title, slogan and logo
- *Company*: company details and company logo

## Preview

### Toolbar

The four formats sit on the left above the preview. To their right:

**Background** — five symbols deciding what the overlay sits on in the preview:

| Symbol | Background |
| --- | --- |
| Grid | Dark chequerboard (default) |
| Sun | Light chequerboard |
| Moon | Black |
| Square | White |
| Image | Upload your own background image |

The chequerboard shows transparency. Black and white check the contrast at both extremes.

### Background image

Once an image is uploaded, its framing can be adjusted:

- **Drag** moves the image
- **Scroll wheel** zooms around the pointer, up to six times
- **Double-click**, or a click on the percentage, resets the framing
- The **X** beside it removes the image

The framing is stored as a fraction of the image area, not in pixels. Resize the window and the same part of the image stays in view.

It is kept **per template and per format**, deliberately: a portrait crops a photo differently from a landscape, and a template that lays a scrim along the bottom needs a different part of the picture in frame than one with a bug in the corner. Frame each combination once and it stays that way.

Resetting follows the same rule and only touches what is on screen. Load a **different picture** and every framing is dropped - each was measured against that one photo.

> [!NOTE] The background image is kept
> In the export it is drawn underneath the overlay, so the file is finished as it stands. Since 1.2.0 it also survives a reload, and it can be saved with the setup - see [Saving and moving](10-saving-and-moving.md).

### Badges

Two readouts sit in the upper corners of the preview. On the left the pixel size of the chosen format, with a dot that is green when everything is ready, amber while loading and red on an error. On the right the current combination of product, template and colour set.

## Export bar

At the bottom, the version number and links to the project, the manual and the license sit on the left; the two export buttons on the right. During a ZIP export a progress bar appears in the *Export* area of the sidebar.
