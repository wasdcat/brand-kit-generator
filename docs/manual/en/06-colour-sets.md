# Colour sets

A colour set is a named arrangement of seven colours. Switching sets recolours the overlay without touching the layout.

## The seven roles

Colours are not assigned to individual elements but to **roles**. The template decides where a role shows up.

| Role | What it is for |
| --- | --- |
| **Background** | Areas, the bar of a lower third say |
| **Accent** | Highlights, the product name or a tag |
| **Secondary** | Second accent colour, the middle of a gradient |
| **Text** | Body text, the title |
| **Subtext** | Second text level, the subtitle |
| **Description** | Smallest text level |
| **Border** | Edges and rules |

Seven roles are deliberately few. They force a decision instead of letting a palette sprawl — and they make a colour set work in any template, including one that does not exist yet.

## Assignment

Under the colour values sits the *Assignment* block. It decides **which role a design object uses**:

| Object | Default |
| --- | --- |
| Tag 1 | Accent |
| Tag 2 | Secondary |

This creates no eighth colour. The assignment merely points at one of the seven that exist. To colour both tags alike, set both to the same role.

*Background* is deliberately not offered: the text **inside** a chip runs in the background colour. A chip in the same colour would be invisible.

## Managing sets

**Duplicate** makes a copy of the set being edited. That is how new sets come about — you never start from nothing.

**Show in preview** moves the set you are editing into the preview. Editing and showing are separate: you can work on one set while the preview shows another. If the set being edited is already active, it says *Active in preview* instead.

**Reset** returns a shipped set to its factory state. Sets you created yourself have no factory state; the application says so.

**Delete** removes a set. Both buttons ask once.

## The "Default" entry

Every list holds an entry named **Default**. It can be neither renamed nor deleted. It is the fallback: if a set is deleted, or a loaded setup names a set this installation does not have, *Default* takes over.

The default colour set is kept neutral and high in contrast so it works over any material. The five named sets beside it are the actual design work.

> [!TIP] Setting up your brand colours
> Duplicate *Default*, name the copy after your brand and enter the colour values. From then on your set is one click in the *Creation* area — and you never type a hex value again.
