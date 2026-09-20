# First steps

## Starting the application

The application needs a web server. A very simple one that only serves files is enough.

**With Visual Studio Code:** Install the *Live Server* extension, right-click `src/index.html` in the project, then *Open with Live Server*.

**With Python:** Open a terminal in the `src/` folder and start:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/index.html` in the browser.

> [!TIP] How you know it is running
> The address bar starts with `http://`, and the preview area on the right shows the overlay on a chequerboard. If it says "The template could not be rendered" instead, the file was opened by double-clicking.

## Your first post in five steps

Everything is filled with sample values on first start. You can begin straight away.

**1. Pick a format.** The four formats sit above the preview. Click the one you need — `9:16` for a story, say.

**2. Type your text.** The *Creation* area is open on start. Enter your title under *Content for this post*. The preview follows immediately.

**3. Pick the look.** Higher up in the same area are four selectors: product, template, font set and colour set. Try a different colour set — the overlay changes colour, the text stays put.

**4. Check it against real material.** A row of symbols above the preview switches the background: dark and light chequerboard, black, white and — through the image symbol — your own background image. That is how you see whether the overlay stays readable over your footage. A background image is more than something to look at: it is exported underneath the overlay.

**5. Export.** Bottom right, **PNG (`*format*`)** (such as **PNG (9:16)**) produces the file for the format currently selected. **ZIP (all formats)** puts every selected format into one archive. (In the *Export* area, you also find **Download the current view as PNG** and **Export all formats as a ZIP package**.)

Done. The PNG is in your downloads folder and ready for the edit.

## What to set up next

The sample values are there to try things out. For day-to-day use three things are worth doing, in this order:

1. **Company** (*Company* area): name, slogan, copyright line and logo. This rarely changes and appears in nearly every template.
2. **Product** (*Products* area): one entry per show, game or series, with title and logo.
3. **Colour set** (*Colour set* area): put your brand colours into a set of their own instead of reaching for the default every time.

After that a new post is: pick the product, type the title, export.

> [!NOTE] Everything is saved automatically
> There is nothing to confirm. Every change lands in the browser's storage right away and is back after a reload. You only need a file backup when moving your setup to another machine, or to protect it against cleared browser data.
