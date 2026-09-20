"""What the export does to text that a template clamps.

A template caps its title at two or three lines and its subtitle at one. The
browser draws the dots of that cut in the preview but not into a PNG, so the
renderer shortens the text to real characters plus an ellipsis before the
screenshot and puts the original back afterwards.

Deciding whether anything is cut off at all is where this has gone wrong twice.
`scrollHeight` reports the overhang of the font's own ascent and descent, not of
the visible glyphs, so a line-height tighter than that box leaves a few pixels
outside the content box on every single line - one line or four, cut off or not.
Measured against a one-pixel tolerance every clamped element looked like it
overflowed and no prefix ever fitted, which left the title as a bare ellipsis in
1.1.0 and unshortened with no ellipsis in 1.1.1.

These tests therefore ask two things of every title, in every format and every
bundled family: one that fits comes out whole, and one that does not comes out
shortened with real text still in it.
"""

from pixels import diff_bbox, ink_bbox, open_png

SHORT_TITLE = "Episode #42: The Ray Tracing Future"
# Same length, different glyphs from the first character on. Rendering the frame
# with each in turn and comparing shows where the title's own ink sits.
OTHER_TITLE = "Chapter #17: Our Path Tracing Guide"

# Long enough to be cut off in every template and every format: the roomiest
# combination is the lower third in 16:9, which holds about 200 characters.
LONG_TITLE = (
    "Episode #42: The Ray Tracing Future and What It Means for Real-Time "
    "Graphics in Games, Film and Everything Else We Render Today, Tomorrow and "
    "for Every Frame After That, Including the Ones Nobody Asked About, the "
    "Ones We Rendered Twice and the Ones That Never Made It Into the Cut at All"
)
# One line only, and the widest format gives it about 110 characters, so this is
# comfortably past it everywhere.
LONG_SUBTITLE = (
    "Special guest: Alexander Vance, lead rendering engineer, on everything "
    "that did not fit into the episode itself, the parts that did, and the "
    "handful of things we promised to come back to in a later episode"
)

ELLIPSIS = "…"


def test_the_two_probe_titles_stay_comparable():
    """Guards the pair the pixel test below leans on."""
    assert len(SHORT_TITLE) == len(OTHER_TITLE)
    assert SHORT_TITLE[0] != OTHER_TITLE[0]


def test_a_title_that_fits_is_drawn_unchanged(app, titled_template_id, format_id):
    """The regression: a title that fits was being replaced by an ellipsis."""
    app.select(template=titled_template_id, fmt=format_id, title=SHORT_TITLE)
    app.export_png(capture=True)

    assert app.drawn("title")["text"] == SHORT_TITLE


def test_a_title_that_fits_reaches_the_png_in_full(app, titled_template_id, format_id):
    """The same thing again, read off the PNG rather than out of the DOM.

    A title cut back to an ellipsis still has a box and, over a scrim, still has
    ink in it. What tells the two apart is how far across that box the drawing
    follows the wording.
    """
    app.select(template=titled_template_id, fmt=format_id, title=SHORT_TITLE)
    with_short = app.export_png(capture=True)
    box = app.drawn("title")["box"]
    text_width = app.laid_out_text_width("title")

    app.select(title=OTHER_TITLE)
    with_other = app.export_png()

    changed = diff_bbox(with_short, with_other, box)
    assert changed is not None, "the wording of the title did not reach the PNG"

    changed_width = changed[2] - changed[0]
    assert changed_width > text_width * 0.6, (
        f"the title follows the wording across {changed_width:.0f}px where its "
        f"text is {text_width:.0f}px wide - it was cut back before the screenshot"
    )


def test_an_overlong_title_is_shortened_to_real_text(app, titled_template_id, format_id):
    app.select(template=titled_template_id, fmt=format_id, title=LONG_TITLE)
    app.export_png(capture=True)
    drawn = app.drawn("title")["text"]
    clamp = app.clamps("title")

    if not (clamp["lines"] or clamp["line"]):
        # example-2 lets a long title wrap instead of cutting it. Nothing is
        # clamped, so nothing may be shortened either.
        assert drawn == LONG_TITLE, "an unclamped title was shortened anyway"
        return

    assert drawn != LONG_TITLE, "a title far past the clamp was drawn in full"
    assert drawn.endswith(ELLIPSIS), f"shortened without an ellipsis: {drawn!r}"
    assert len(drawn) > 12, f"shortened to almost nothing: {drawn!r}"
    assert LONG_TITLE.startswith(drawn[:-1].rstrip()), (
        f"the shortened title is not the start of the original: {drawn!r}"
    )


def test_no_field_is_ever_reduced_to_a_bare_ellipsis(app, template_id, format_id):
    """The invariant behind all of this, asked of every field at once.

    Whenever the search for a length that fits comes up empty, the text is put
    back whole rather than replaced by the dots it was cut down to. Any way of
    reaching that state counts - a tolerance that reports overflow where there
    is none, or a box whose width follows its content and narrows along with
    the text. No field may ever come out as nothing but dots.
    """
    app.select(
        template=template_id,
        fmt=format_id,
        title=LONG_TITLE,
        subtitle=LONG_TITLE,
        description=LONG_TITLE,
        tag="A VERY LONG TAG INDEED",
        tag2="AN EVEN LONGER SECOND TAG",
    )
    app.export_png(capture=True)

    bare = {
        slot: drawn["text"]
        for slot, drawn in app.drawn_slots().items()
        if drawn["text"].strip(ELLIPSIS + " ") == "" and drawn["text"] != ""
    }
    assert not bare, f"drawn as nothing but dots: {bare}"


def test_every_bundled_family_keeps_a_fitting_title(app, font_id):
    """Whether a title fits is a question of font metrics, so ask every family.

    The tolerance that decides this comes from the line-height, and a family
    whose ascent and descent sit differently inside that line is exactly what
    used to tip the measurement over.
    """
    app.select(template="example-3-title-card", fmt="16:9", font=font_id, title=SHORT_TITLE)
    app.export_png(capture=True)

    assert app.drawn("title")["text"] == SHORT_TITLE


def test_a_subtitle_that_fits_is_drawn_unchanged(app):
    app.select(
        template="example-3-title-card",
        fmt="16:9",
        subtitle="Special guest: Alexander Vance",
    )
    app.export_png(capture=True)

    assert app.drawn("subtitle")["text"] == "Special guest: Alexander Vance"


def test_an_overlong_subtitle_gets_an_ellipsis(app):
    """The single-line case: the browser's own dots never reach the PNG."""
    app.select(template="example-3-title-card", fmt="16:9", subtitle=LONG_SUBTITLE)
    app.export_png(capture=True)
    drawn = app.drawn("subtitle")["text"]

    assert drawn != LONG_SUBTITLE, "an overlong subtitle was drawn in full"
    assert drawn.endswith(ELLIPSIS)
    assert LONG_SUBTITLE.startswith(drawn[:-1].rstrip())


def test_shortening_is_undone_after_the_export(app):
    """Otherwise every export would eat into the text a little further."""
    app.select(template="example-3-title-card", fmt="1:1", title=LONG_TITLE)
    app.export_png(capture=True)

    assert app.stage_text("title") == LONG_TITLE


def test_repeated_exports_draw_the_same_text(app):
    """A ZIP renders one format after another on the same stage."""
    app.select(template="example-3-title-card", fmt="1:1", title=LONG_TITLE)
    app.export_png(capture=True)
    first = app.drawn("title")["text"]
    app.export_png(capture=True)
    second = app.drawn("title")["text"]

    assert first == second, "the second export shortened the title further"


def test_a_roomier_format_gets_at_least_as_much_title(app):
    """A cut made for 1:1 must not follow the title into the wider 16:9."""
    app.select(template="example-3-title-card", fmt="1:1", title=LONG_TITLE)
    app.export_png(capture=True)
    square = app.drawn("title")["text"]

    app.select(fmt="16:9")
    app.export_png(capture=True)
    landscape = app.drawn("title")["text"]

    assert len(landscape) >= len(square), (
        f"16:9 drew less title than 1:1: {landscape!r} against {square!r}"
    )


def test_an_empty_title_is_left_out_entirely(app):
    """An empty field disappears instead of leaving a gap or an ellipsis."""
    app.select(template="example-3-title-card", fmt="16:9", title="")
    png = app.export_png(capture=True)
    drawn = app.drawn("title")

    assert drawn["text"] == ""
    assert drawn["box"]["height"] == 0, "the empty title still takes up room"
    assert ink_bbox(open_png(png)) is not None, "the rest of the frame vanished with it"
