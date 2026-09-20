# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

