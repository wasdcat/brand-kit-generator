# Saving and moving

## Automatically, in the browser

Every change is put into your browser's storage a moment later. After a reload everything is back. Nothing needs confirming.

That storage has three properties worth knowing:

- It is **per browser and per machine**. Chrome at the office and Chrome at home know nothing of each other.
- It is **deleted along with** your browser data — including when you only meant to clear cookies.
- It holds around **5 MB**. That is why logos are scaled down on upload.

> [!IMPORTANT] Browser storage is not a backup
> It is convenient but volatile. Anything you have worked on for a while belongs in a file as well.

## Saving to a file

**Save setup** in the header downloads the complete setup as a JSON file.

That file is your backup, your way onto another machine, and your means of keeping several setups side by side — one per client, say.

Not included are the background image and the choice between the light and dark interface, or the interface language. The interface settings belong to the workplace, not to the brand; the background image stays out because a photo at full size would bloat the file.

## Loading from a file

**Load setup (JSON)** opens the file picker. After choosing, a dialog appears **before** anything is taken over. It shows:

- the file name
- the schema version of the file
- which areas it contains
- a note about the version, where applicable

> [!CAUTION] Loading replaces the current setup
> An import overwrites company, products, colour sets, font sets and the text. Anything not saved to a file is gone afterwards. The dialog says so; *Cancel* or the Escape key back out, *Replace setup* goes ahead.

### When a file is rejected

Not every JSON file is a setup. Every file the generator writes carries an identifier. If it is missing, or belongs to another tool, the file is rejected — with a message saying why. You cannot import a foreign configuration by accident.

### When the version does not match

A file from a newer version of the generator is still read. The dialog notes that parts this version does not know will be skipped.

The other way round: whatever an older file does not bring — a font set, the typography mapping — is filled in with the defaults on load rather than producing an error.

## Moving to another machine

1. On the old machine, **Save setup**
2. Transfer the JSON file
3. On the new machine, open the application and **Load setup (JSON)**
4. Confirm in the dialog

The template files themselves travel with the project folder, not with the JSON. Anyone who built their own templates has to take them along.

## Resetting everything

The circular arrow in the top right restores the factory state: the shipped products, colour sets and font sets, the sample text and the full template catalogue, including any previously removed.

The button asks once — the first click arms it, a second within four seconds carries it out.

> [!TIP] Save first
> Make a backup through *Save setup* before resetting. A reset cannot be undone; a file can simply be loaded again.
