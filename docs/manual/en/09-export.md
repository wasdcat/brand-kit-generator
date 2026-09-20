# Export

## The two routes

**PNG** at the bottom right produces a single file in the format currently chosen.

**ZIP (all formats)** produces an archive with every format ticked in the *Export* area. You can untick individual ones there if you never need landscape, say.

During a ZIP export the *Export* area shows a progress bar naming the format being rendered.

## What comes out

A PNG with a transparent background, made to lie over your stills or clips as an overlay. If a background image has been loaded and placed, it is exported with it — ready to upload, to social media say.

The file has exactly the pixel dimensions of the format, no matter how large the preview happens to be shown. The preview is a scaled-down view; rendering always happens at full size.

### File names

Individual PNG files follow the pattern:

```
product_template_colourset_format.png
```

So `sample_show_lower_third_neon_purple_1x1.png`. Everything is lower case, and every character that is neither a letter nor a digit becomes an underscore — the hyphen of a template id and the colon of the format included.

The ZIP archive is named after the product and contains a folder of the same name:

```
sample_show_overlays.zip
  └── sample_show_overlays/
      ├── sample_show_lower_third_neon_purple_1x1.png
      ├── sample_show_lower_third_neon_purple_9x16.png
      ├── …
      ├── brand-setup.json
      └── background.png
```

### brand-setup.json

Every ZIP carries the setup the images came from.

That makes an export reproducible. Anyone needing those files again months later loads the enclosed JSON through *Load* and stands where you stood when you exported.

### background.png

If a background image was set, it sits beside the setup as a file of its own, carrying the picture's own extension - `background.jpg` for a JPEG. Not inside the JSON, where encoding it as text would make it a third larger and impossible to look at. The JSON names it and keeps the framing.

After loading the JSON the application therefore asks for the picture. Pick the file from that same folder and the framing is back in place.

## What differs from the preview

Two things worth knowing.

**The preview backgrounds do not travel — an uploaded image does.** Chequerboard, black and white are aids for judging contrast; in the export there is transparency in their place. An uploaded background image is the exception: it belongs to the picture and is exported underneath the overlay.

**Overlong text is cut.** Where a template limits the number of lines, text beyond it is cut at a word boundary before the export and given a real `…`. The browser does not draw its own ellipsis into an image file — without this step the text would simply be chopped off in the PNG.

What you typed is untouched; only the image file is shortened.

## Browsers

> [!WARNING] Safari is not reliable
> The export is verified for Chrome and Edge. Safari handles the underlying technique differently; results can be incomplete or fail entirely. Use Chrome or Edge to export.

## Further use

The PNG goes on top of your material as the uppermost track:

- **Video editors** — as an image in the timeline, above the clip
- **Streaming software** — as an image source above the camera source
- **Image editors** — as a layer above the photo

No conversion is needed. Where the overlay is transparent, that transparency is in the file and is understood directly by all of them.
