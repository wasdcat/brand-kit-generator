<p align="center">
  <img src="media/logo/wasdcat_bkg_logo_plate.png" alt="Brand Kit Generator Logo" width="150">
</p>

# Brand Kit Generator

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

A browser-based tool for creating pixel-perfect, transparent PNG overlays for social media based on modular HTML/CSS templates.

## Key Features

* **Transparent PNG output, or a finished picture:** On its own an export is a PNG with a transparent background, meant to sit as the topmost layer over video or stills in any editor or streaming software. Put a background image underneath and that image is exported with the overlay — the file is then ready to upload.
* **A setup you can put down and pick up:** Product, brand, colours, fonts, wording and the background — including how it is framed for each template and format — are saved in the browser and can be written to a file to move between machines or keep one setup per client.
* **Five independent building blocks:** Product, template, colour set, font set and content are chosen separately. A different colour set changes the colour without touching the layout, a different template changes the layout without retyping the text.
* **Four output formats:** The same template renders at 1:1, 9:16, 16:9 and 4:5, and adapts its layout to each one.
* **Bundled fonts and colour sets:** Seven open-source variable font families ship with the tool, alongside colour sets of seven colour roles each.
* **Runs offline:** No accounts, no tracking, no build step, no network requests — everything happens in the browser. All four formats can be exported at once as a ZIP archive.

## Manual

* **English:** [PDF Manual](src/docs/manual/brand_kit_generator_en.pdf) &middot; [Online edition (Markdown)](docs/manual/en/README.md)
* **German:** [PDF-Handbuch](src/docs/manual/brand_kit_generator_de.pdf) &middot; [Online-Fassung (Markdown)](docs/manual/de/README.md)

## Tests

The export is the part worth testing, and the only honest way to test it is to
run it: the suite serves `src/` and drives the real page in headless Chromium,
then reads back the PNG the browser would have saved. It covers every template
in every format, the ZIP package, the background composite and what the export
does to text a template cuts off.

```sh
python -m pip install -r tests/requirements.txt
python -m playwright install --with-deps chromium
python -m pytest
```

## License

&copy; 2026 WASDCAT Games  
Licensed under the [MIT License](LICENSE).  

*Fonts: [SIL Open Font License 1.1](src/fonts/LICENSES.txt).*
