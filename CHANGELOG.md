# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-09-20

### Added
- **The Background Image Belongs to the Setup**: Since 1.1.0 an uploaded background is part of the picture rather than a preview aid, but it was the one thing a setup did not carry. It does now. The framing travels with every setup; the picture itself is asked about when saving - with it the file is complete, without it the file stays small, keeps the framing and names the picture to pick again after loading. The preview then shows that name until it is picked, and picking it slots into the framing instead of resetting it. Picking a different picture is asked about first, since the framing it would drop was measured against the named one and, with no picture on screen, cannot be seen going. A ZIP carries the picture as a file of its own beside `brand-setup.json`.
- **A Framing per Template and Format**: Pan and zoom are remembered for each combination rather than once for everything. Both decide what belongs in frame - a format by the shape it cuts to, a template by where it puts its ink - and a ZIP now composes each format with its own framing rather than with the one the preview happens to show. Loading a different picture drops every framing, since each was measured against the one before. Only combinations that were actually framed are stored.
- **The Background Survives a Restart**: `src/store.js` keeps the picture in IndexedDB. localStorage is written as one string and holds about 5 MB, so a photograph there would not merely fail to save - it would take the whole setup down with it, which is why logos are capped at 512 px. The framing and the file name stay in the setup; only the bytes move.
- **Export Test Suite**: `tests/` drives the real page in headless Chromium and reads back the file the browser would have saved. It walks every template in every format, the ZIP package, the background composite, the setup file and its way back in, and asks of every title, in every format and every bundled family, that one which fits comes out whole and one which does not comes out shortened with real text still in it. Both earlier states of the title bug fail it. `.github/workflows/ci.yml` runs it on every push and pull request, alongside the manual build, and the README says how to run them by hand.

### Changed
- **Project Texts**: A setup is now something you can put down and pick up, background and framing included, which neither the README's feature list nor `docs/description.md` said. Both carry the same list, so both were extended, and the itch.io text says what belongs to a setup in its own section.
- **Header Buttons**: The two setup buttons read "Load" and "Save" rather than "Load setup (JSON)" and "Save setup". What is being loaded is clear from where the button sits, and which file format it is in is the tooltip's business. The manuals follow, in both languages - the German ones had been naming the English labels.
- **Manuals**: Rewritten in German and English wherever 1.2.0 made them wrong. The interface and saving chapters said the background image was neither stored nor saved, and that a format change keeps the same framing. The export chapter's archive listing did not show `background.png` and promised that loading the enclosed setup puts you exactly where you were, which now needs the picture picked from the same folder. Troubleshooting still suggested the background as something to clear out of a full browser store, where it no longer is. The German chapters also quoted the English interface throughout - button labels and the storage message alike.
- **A Retracted Limitation**: `example-2-angled-bar.html` carried a note that its title could not be line-clamped at all, because the box follows the width of its content and every shortening would narrow it further. Measured, that turns out to have been the overflow bug above rather than the geometry: `--max-width` pins the box for any title long enough to be cut. The template still lets a long title wrap, which is a choice about the design, and the note now says so.

### Fixed
- **Strings That Never Reached the Interface**: The load button had no tooltip, the byline read "by WASDCAT Games" in the German interface and the note in the template area stayed English there - in each case the wording sat in `i18n.js` while the markup carried its own copy or nothing at all. All three now come from the language tables, `common.edit` was dropped as a duplicate of the `wf.edit` actually in use, and a test fails on any key the interface never asks for.
- **Title in the Title Card Export**: The export-time check for text that a line clamp cuts off measured against a one-pixel tolerance. `scrollHeight` also reports the overhang of the font's own ascent and descent, so a line-height below that box - 1.06 on the title of the title-card template - made every title look like it overflowed, on one line as much as on four. The search for a length that fits then found none and gave up, which in 1.1.0 left the title as a bare ellipsis and in 1.1.1 left it unshortened with no ellipsis at all. The tolerance is now half a line in the block direction and a quarter em inline, which swallows that overhang and still catches a cut-off line. A title that is too long is shortened to real text with an ellipsis again, in all four formats.
- **Export Status in the Interface Language**: The three messages shown while an export runs were written into the source rather than looked up - "Rendere PNG..." stayed German in the English interface, "Rendering 16:9 (1/4)..." and "Building ZIP package..." stayed English in the German one. They now come from `i18n.js`, as does the ZIP button in the bottom bar.

## [1.1.1] - 2026-09-20

### Fixed
- **Title Card Subtitle Wrapping**: Prevented subtitle line wrapping in the title-card template during export by enforcing a single-line ellipsis style.
- **Export Text Clamping Stability**: Hardened export-time text clamping so overlong clamped fields no longer collapse to empty content in edge cases.

## [1.1.0] - 2026-09-20

### Changed
- **Background Image in Export**: An uploaded background image is now composited underneath the overlay at full output resolution and written into both the single PNG and every format of the ZIP package. The framing set in the preview (pan and zoom) carries over unchanged. Without a background image the export remains a transparent PNG as before. The image was previously a preview-only aid, labelled "test image" throughout the interface and manuals.
- **Output Format Labels**: Renamed the four formats to `Square` / `Quadratisch`, `Vertical` / `Hochformat`, `Landscape` / `Querformat` and `Portrait`, consistently in the application and both manuals.
- **Third-Party Brand Names**: Replaced all references to external platforms and software with generic descriptions across interface strings, both manuals, the template CSS comments, the project README and the manual subtitles.
- **README Feature List**: Rewrote the key features in plain wording, with the format count, bundled font families and colour role count verified against the source.
- **License Spelling**: Unified the British "licence" to "License" in the English manual and the interface strings.

### Added
- **itch.io Project Text**: `docs/description.md` holds the ready-to-copy description for the itch.io project page.

### Removed
- **Safe Zones Overlay**: Removed the 9:16 safe-zone guide in full - toolbar toggle, preview overlay, the associated `currentFormat` icon watcher, ten interface strings and the manual section in both languages. The feature was not part of the requirements.

## [1.0.1] - 2026-09-20

### Changed
- **Copyright & Attribution**: Updated copyright notices across `LICENSE`, `README.md`, and manuals to `WASDCAT Games`.
- **Company Panel**: Fixed text styling on the company name input field so user input is no longer forced to uppercase.
- **Manual Status**: Transitioned document status in manual configurations to `Freigegeben` (DE) and `Released` (EN), and rebuilt the offline PDF documents.

### Fixed
- **CI Workflow**: Removed obsolete pip cache configuration that caused build failures when no requirements file is present.
- **GitHub Pages Deployment**: Configured tag deployment policy (`v*`) on the `github-pages` environment to enable automated deployments from release tags.

## [1.0.0] - 2026-09-19

### Added
- **Core Application**: Browser-based social media overlay generator with zero build step, built with Vue 3 and Tailwind CSS.
- **Template System**: Modular HTML/CSS overlay templates (`corner-bug`, `angled-bar`, `title-card`) with dynamic token substitution.
- **Customizable Brand Presets**: Manage brand logos, products, color sets, and typography styles.
- **Variable Fonts**: Bundled local variable fonts including Recursive, Inter, Orbitron, Fraunces, Archivo, Open Sans, and Space Grotesk with OFL licenses.
- **Export Formats & Ratios**: Multi-ratio support (1:1 Square, 9:16 Vertical, 16:9 Landscape, 4:5 Portrait) with transparent PNG rendering via `modern-screenshot`.
- **Batch Export**: Export all template variations into a structured ZIP archive via `JSZip` with an integrated progress bar.
- **100% Offline Capability**: Fully vendored client-side runtime dependencies (`Vue 3`, `Tailwind CSS`, `Lucide Icons`, `JSZip`, `modern-screenshot`) with zero external CDN dependencies.
- **Storage Management**: Auto-saving state to `localStorage` with quota protection (image downscaling, SVG sanitization, debounced persistence).
- **Theme Support**: Integrated dark and light studio themes with instant switching.
- **Documentation**:
  - Comprehensive user manuals in German and English (Markdown and printable PDF editions).
  - Modular chapter navigation via dedicated manual README files (`docs/manual/de/README.md`, `docs/manual/en/README.md`).
- **Automation & CI/CD**:
  - Automated manual build pipeline script (`scripts/build_manuals.py`) powered by `markpublish`.
  - GitHub Actions CI workflow to test and build PDF manuals on push.
  - GitHub Actions Release workflow for automated deployment of `src` to GitHub Pages upon release creation.

