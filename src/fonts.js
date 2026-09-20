/**
 * WASDCAT Brand Kit Generator - Font catalogue
 *
 * One shared config for every bundled family. The font files themselves live in
 * `fonts/` and are declared in `fonts/fonts.css`; this file describes what the
 * app may offer for each of them.
 *
 * Every family is a variable font. `axes` lists the axes worth exposing as a
 * control - the app builds one slider per entry, so adding an axis here is the
 * only step needed to make it adjustable. A family with an empty list simply
 * gets no sliders.
 *
 * Deliberately NOT listed as an axis:
 *   wght  Weight belongs to the template. Its weights are its hierarchy (900
 *         product, 800 title, 700 tag, 400 copyright); a global weight control
 *         would either flatten that or fight it. `weight` below only documents
 *         the range the family supports.
 *   opsz  Optical size. Browsers apply it automatically from the font size
 *         (`font-optical-sizing: auto`), and setting it by hand usually makes
 *         things worse rather than better.
 */
(function () {
  const FONTS = [
    {
      id: 'Recursive',
      name: 'Recursive (Corporate)',
      weight: '300 1000',
      axes: [
        { tag: 'CASL', min: 0,   max: 1, step: 0.05, default: 0 },
        { tag: 'MONO', min: 0,   max: 1, step: 0.05, default: 0 },
        { tag: 'slnt', min: -15, max: 0, step: 1,    default: 0 },
        { tag: 'CRSV', min: 0,   max: 1, step: 0.5,  default: 0 }
      ]
    },
    {
      id: 'Orbitron',
      name: 'Orbitron (Gaming Display)',
      weight: '400 900',
      axes: []
    },
    {
      id: 'Archivo',
      name: 'Archivo (Adjustable width)',
      weight: '100 900',
      axes: [
        { tag: 'wdth', min: 62, max: 125, step: 1, default: 100 }
      ]
    },
    {
      id: 'Inter',
      name: 'Inter (Neutral content)',
      weight: '100 900',
      axes: []
    },
    {
      id: 'Space Grotesk',
      name: 'Space Grotesk (Technical)',
      weight: '300 700',
      axes: []
    },
    {
      id: 'Fraunces',
      name: 'Fraunces (Editorial serif)',
      weight: '100 900',
      axes: [
        { tag: 'SOFT', min: 0, max: 100, step: 1,   default: 0 },
        { tag: 'WONK', min: 0, max: 1,   step: 1,   default: 0 }
      ]
    },
    {
      id: 'Open Sans',
      name: 'Open Sans (Interface)',
      weight: '300 800',
      axes: [
        { tag: 'wdth', min: 75, max: 100, step: 1, default: 100 }
      ]
    }
  ];

  window.BKG_FONTS = FONTS;
})();
