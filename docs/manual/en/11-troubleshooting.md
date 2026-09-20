# Troubleshooting

## The preview stays empty and reports an error

**Message:** *The template could not be rendered*

**Most common cause:** The file was opened by double-clicking and the address bar starts with `file://`. Browsers refuse to load the template files in that case.

**Fix:** Open the application through a web server, see *First steps*. The address has to start with `http://`.

**Other cause:** The template manifest names a file that does not exist, or the file has no element with the class `frame`. The message names the file.

## The background switch appears to do nothing

The switch acts on the area **behind** the overlay. When the preview reports an error, a nearly opaque message sits on top of it — the background does change, but it is covered.

Fix the error message first, see above.

## Symbols are missing or look dead

Opening the application right after the project was updated, the browser may still be using old program files from its cache.

**Fix:** Reload bypassing the cache — `Ctrl`+`Shift`+`R` on Windows, `Cmd`+`Shift`+`R` on macOS.

## "Browser storage is full"

Browser storage is full; your setup was **not** saved.

**Right away:** *Save* in the header, to rescue your work into a file.

**Then:** Delete products you no longer need, especially ones with a large logo. Store logos as SVG rather than PNG — they are many times smaller.

## The export does nothing, or produces something unusable

**Check the browser.** The export is verified for Chrome and Edge. In Safari it is not reliable.

**Check for a download block.** Some browsers block several downloads in a row. A ZIP export is one file; repeated single exports can trip the block.

## The title is cut off in the export

That is intended where the template limits the number of lines. The overhang is cut at a word boundary and given a `…`.

**Fix:** Shorten the title. Or pick a template with more room for text — *Example 3 — Title Card* allows three lines.

## Changing a colour has no effect

Editing and showing are separate. You may be editing a different set from the one the preview shows.

**Fix:** Click **Show in preview** in the *Colour set* area. If it already says *Active in preview*, you are editing the right set — and the template simply does not use that role in the place you are looking at.

## A font variation cannot be selected

The mapping in the *Template* area only offers variations from the font set **currently chosen**.

**Fix:** Select the right font set in the *Creation* area, or create the variation you want in the current set.

## A file cannot be imported

**Message:** *No Brand Kit setup* or *The file belongs to …*

The file does not carry the Brand Kit Generator's identifier. Either it comes from another tool, or it is not a setup at all — a `brand-setup.json` from a ZIP of a very old build, say.

**Fix:** Use a file produced by *Save* of this application.

## A template has vanished from the selector

It was taken out of the catalogue with **Remove**. The file is still there.

**Fix:** Click **Restore** in the note in the *Template* area. Alternatively, *Reset to factory defaults* restores the full catalogue — but resets everything else along with it.

## The interface is in the wrong language

The application follows what your browser reports and falls back to English.

**Fix:** The **DE / EN** button in the header switches at any time; the choice is remembered. It shows the language it would switch to.

## Nothing helps

Reset as a last resort — but **save first** through *Save*. You can then load the file again and see whether the problem was in your setup or in the build.
