"""The background image as part of a setup.

Since 1.1.0 the background is not a preview aid but part of the picture: it is
composed underneath the overlay at full export resolution. From 1.2.0 it is
saved with the setup - the framing always, the picture itself on request.

The framing is kept per template and per format, because both decide what you
want in frame: a template by where it puts its ink, a format by the shape it
cuts to. That makes one rule worth guarding above all others - a ZIP renders
all four formats in a row while the preview stays where it is, so each PNG has
to be composed from the row of the format being rendered, not from the one on
screen.
"""

import io
import json
import zipfile

import pytest
from PIL import Image

from pixels import open_png

SIZE = (400, 300)


def _gradient():
    """Colour states position: red rises to the right, green downwards.

    An export composed over this can be read back: which part of the picture is
    in frame, which way up it sits, and how much of it a zoom leaves visible.
    """
    image = Image.new("RGB", SIZE)
    image.putdata(
        [
            (x * 255 // (SIZE[0] - 1), y * 255 // (SIZE[1] - 1), 128)
            for y in range(SIZE[1])
            for x in range(SIZE[0])
        ]
    )
    return image


@pytest.fixture(scope="session")
def picture(tmp_path_factory):
    """The background as a file, because the app takes it from a file picker."""
    path = tmp_path_factory.mktemp("pictures") / "holiday.png"
    _gradient().save(path)
    return path


@pytest.fixture(scope="session")
def other_picture(tmp_path_factory):
    path = tmp_path_factory.mktemp("pictures") / "a-different-picture.png"
    _gradient().transpose(Image.FLIP_LEFT_RIGHT).save(path)
    return path


@pytest.fixture(scope="session")
def picture_renamed(tmp_path_factory):
    """The same name in a different case, as a file system would still match."""
    path = tmp_path_factory.mktemp("pictures") / "HOLIDAY.PNG"
    _gradient().save(path)
    return path


def red_span(image, row=None):
    """How much of the picture's width is in frame, on a 0-255 scale."""
    row = image.height // 2 if row is None else row
    values = [image.getpixel((x, row))[0] for x in range(0, image.width, 8)]
    return max(values) - min(values)


# -- framing is kept per template and per format --------------------------


def test_the_framing_is_separate_per_format(app, picture):
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    app.zoom_background(3)

    app.select(fmt="16:9")
    assert app.framing["zoom"] == 1, "16:9 inherited the zoom set for 1:1"

    app.select(fmt="1:1")
    assert app.framing["zoom"] == 3, "1:1 lost the zoom that was set for it"


def test_the_framing_is_separate_per_template(app, picture):
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    app.zoom_background(3)

    app.select(template="example-3-title-card")
    assert app.framing["zoom"] == 1, "the title card inherited the corner bug's zoom"

    app.select(template="example-1-corner-bug")
    assert app.framing["zoom"] == 3


def test_only_framed_combinations_are_stored(app, picture):
    """A row per template times format would be mostly defaults."""
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    assert app.all_framing == {}

    app.zoom_background(2)
    assert app.all_framing == {"example-1-corner-bug": {"1:1": {"x": 0, "y": 0, "zoom": 2}}}


def test_a_new_picture_drops_every_framing(app, picture, other_picture):
    """A framing was measured against one picture and means nothing for another."""
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    app.zoom_background(3)
    app.select(fmt="16:9")
    app.zoom_background(2)
    assert app.all_framing

    app.set_background(other_picture)

    assert app.all_framing == {}


def test_removing_the_picture_drops_every_framing(app, picture):
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    app.zoom_background(3)

    app.remove_background()

    assert app.all_framing == {}


def test_the_reset_button_only_resets_what_is_on_screen(app, picture):
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    app.zoom_background(3)
    app.select(fmt="16:9")
    app.zoom_background(2)

    app.evaluate("(s) => s.resetBgView()")

    assert app.framing["zoom"] == 1
    app.select(fmt="1:1")
    assert app.framing["zoom"] == 3, "resetting 16:9 reached into 1:1"


# -- the export reads the row of the format it renders --------------------


def test_each_format_is_composed_with_its_own_framing(app, picture):
    """The rule a ZIP depends on, checked one PNG at a time."""
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    app.zoom_background(4)
    app.select(fmt="16:9")

    wide = open_png(app.export_png())
    app.select(fmt="1:1")
    square = open_png(app.export_png())

    assert red_span(square) < red_span(wide) * 0.6, (
        "1:1 was zoomed to 4 and 16:9 was not, so 1:1 has to show less picture"
    )


def test_a_zip_composes_every_format_with_its_own_framing(app, picture):
    """Exporting all four at once must not use the preview's row for all of them."""
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    app.zoom_background(4)
    app.select(fmt="16:9")  # the preview sits here, unzoomed

    archive = zipfile.ZipFile(io.BytesIO(app.export_zip()))
    square = open_png(archive.read(next(n for n in archive.namelist() if n.endswith("_1x1.png"))))
    wide = open_png(archive.read(next(n for n in archive.namelist() if n.endswith("_16x9.png"))))

    assert red_span(square) < red_span(wide) * 0.6, (
        "the ZIP composed 1:1 with the framing of the format on screen"
    )


def test_the_zip_carries_the_picture_as_a_file(app, picture):
    app.select(template="example-1-corner-bug")
    app.set_background(picture)

    names = zipfile.ZipFile(io.BytesIO(app.export_zip())).namelist()

    assert any(n.endswith("background.png") for n in names), names


# -- the preview keeps showing it -----------------------------------------


def test_the_preview_places_the_picture_it_is_given(app, picture):
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)

    view = app.evaluate("(s) => s.bgView && { width: s.bgView.width, height: s.bgView.height }")
    assert view is not None, "the preview never worked out where to put the picture"
    assert view["width"] > 0 and view["height"] > 0


def test_the_same_picture_again_stays_visible(app, picture):
    """Setting the same src twice fires no load event, and the size came from it."""
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    assert app.evaluate("(s) => !!s.bgView")

    app.set_background(picture)

    assert app.evaluate("(s) => !!s.bgView"), "the preview lost the picture on a repeat"


def test_a_setup_carrying_the_picture_already_in_place_stays_visible(app, picture, tmp_path):
    """The reported case: the setup was saved from the session it is loaded into."""
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    saved = tmp_path / "same-picture.json"
    saved.write_text(app.export_config(with_image=True), encoding="utf-8")

    app.import_setup(saved)

    assert app.evaluate("(s) => s.bgMode") == "custom"
    assert app.evaluate("(s) => !!s.bgView"), "the picture is there but not shown"


def test_the_picture_is_shown_on_the_first_import(app, picture, tmp_path):
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    saved = tmp_path / "fresh.json"
    saved.write_text(app.export_config(with_image=True), encoding="utf-8")
    app.reset()

    app.import_setup(saved)

    assert app.evaluate("(s) => !!s.bgView"), "it took a second import to show"


# -- the composite itself -------------------------------------------------


@pytest.mark.parametrize("format_id", ["1:1", "16:9", "9:16"])
def test_a_background_image_is_exported_underneath_the_overlay(app, picture, format_id):
    """With a background the file is finished artwork, not an overlay."""
    app.select(template="example-1-corner-bug", fmt=format_id)
    app.set_background(picture)
    image = open_png(app.export_png())

    assert image.getchannel("A").getextrema() == (255, 255), (
        "a composed export must be fully opaque everywhere"
    )
    # Red rises to the right and green downwards in the source picture.
    left = image.getpixel((image.width // 10, image.height // 2))
    right = image.getpixel((image.width * 9 // 10, image.height // 2))
    top = image.getpixel((image.width // 2, image.height // 10))
    bottom = image.getpixel((image.width // 2, image.height * 9 // 10))
    assert right[0] > left[0] + 20, "the picture is not in frame left to right"
    assert bottom[1] > top[1] + 20, "the picture is upside down or squashed"


def test_removing_the_background_restores_transparency(app, picture):
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    assert open_png(app.export_png()).getpixel((5, 5))[3] == 255

    app.remove_background()
    assert open_png(app.export_png()).getpixel((5, 5))[3] == 0


def test_the_background_zoom_reaches_the_export(app, picture):
    """The framing set in the preview is what the file is made from."""
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    plain = open_png(app.export_png())

    app.zoom_background(3)
    zoomed = open_png(app.export_png())

    row = plain.height // 2
    assert red_span(zoomed, row) < red_span(plain, row) * 0.6, (
        "zooming in has to leave less of the picture in frame"
    )


def test_the_background_pan_reaches_the_export(app, picture):
    app.select(template="example-1-corner-bug", fmt="1:1")
    app.set_background(picture)
    app.zoom_background(2)
    centred = open_png(app.export_png())

    app.pan_background(-0.2, 0)
    shifted = open_png(app.export_png())

    row = centred.height // 2
    column = centred.width // 2
    assert shifted.getpixel((column, row))[0] > centred.getpixel((column, row))[0] + 10, (
        "panning left has to bring the right-hand side of the picture into frame"
    )


# -- saving and loading ---------------------------------------------------


def test_a_setup_without_a_background_is_not_asked_about(app):
    app.select(template="example-1-corner-bug")
    setup = json.loads(app.export_config())

    assert setup["background"] is None


def test_a_setup_saved_with_the_picture_brings_it_back(app, picture, tmp_path):
    app.select(template="example-1-corner-bug", fmt="16:9")
    app.set_background(picture)
    app.zoom_background(3)

    saved = tmp_path / "with-image.json"
    saved.write_text(app.export_config(with_image=True), encoding="utf-8")
    setup = json.loads(saved.read_text(encoding="utf-8"))
    assert setup["background"]["image"].startswith("data:image/")

    app.reset()
    assert app.all_framing == {}

    app.import_setup(saved)

    assert app.evaluate("(s) => s.bgMode") == "custom"
    assert app.evaluate("(s) => s.bgName") == "holiday.png"
    assert app.evaluate("(s) => !!s.customBgUrl")
    assert app.evaluate("(s) => s.awaitedBgName") == ""
    app.select(template="example-1-corner-bug", fmt="16:9")
    assert app.framing["zoom"] == 3


def test_a_setup_saved_without_the_picture_keeps_the_framing_and_asks(app, picture, tmp_path):
    app.select(template="example-1-corner-bug", fmt="16:9")
    app.set_background(picture)
    app.zoom_background(3)

    saved = tmp_path / "without-image.json"
    saved.write_text(app.export_config(with_image=False), encoding="utf-8")
    setup = json.loads(saved.read_text(encoding="utf-8"))
    assert "image" not in setup["background"]
    assert setup["background"]["name"] == "holiday.png"

    app.reset()
    app.import_setup(saved)

    assert app.evaluate("(s) => s.awaitedBgName") == "holiday.png"
    assert app.evaluate("(s) => s.bgMode") != "custom"
    app.select(template="example-1-corner-bug", fmt="16:9")
    assert app.framing["zoom"] == 3, "the framing went with the picture"


def test_the_picture_picked_afterwards_slots_into_the_kept_framing(app, picture, tmp_path):
    """The whole point of saving without the picture."""
    app.select(template="example-1-corner-bug", fmt="16:9")
    app.set_background(picture)
    app.zoom_background(3)
    saved = tmp_path / "without-image.json"
    saved.write_text(app.export_config(with_image=False), encoding="utf-8")

    app.reset()
    app.import_setup(saved)
    app.set_background(picture)

    assert app.evaluate("(s) => s.awaitedBgName") == ""
    app.select(template="example-1-corner-bug", fmt="16:9")
    assert app.framing["zoom"] == 3, "picking the awaited picture reset the framing"


def _saved_without_picture(app, picture, tmp_path):
    """A setup that names a background and does not carry it."""
    app.select(template="example-1-corner-bug", fmt="16:9")
    app.set_background(picture)
    app.zoom_background(3)
    saved = tmp_path / "without-image.json"
    saved.write_text(app.export_config(with_image=False), encoding="utf-8")
    app.reset()
    app.import_setup(saved)
    return saved


def test_a_different_picture_is_asked_about_first(app, picture, other_picture, tmp_path):
    """The framing is invisible without a picture, so losing it has to be said."""
    _saved_without_picture(app, picture, tmp_path)

    app.set_background(other_picture, expect_warning=True)

    warning = app.background_warning
    assert warning["expected"] == "holiday.png"
    assert warning["picked"] == "a-different-picture.png"
    assert app.evaluate("(s) => !s.customBgUrl"), "the picture was taken on before the answer"
    app.select(template="example-1-corner-bug", fmt="16:9")
    assert app.framing["zoom"] == 3, "the framing went before the answer"


def test_declining_keeps_the_framing_and_the_wait(app, picture, other_picture, tmp_path):
    _saved_without_picture(app, picture, tmp_path)
    app.set_background(other_picture, expect_warning=True)

    app.answer_background_warning(False)

    assert app.background_warning is None
    assert app.evaluate("(s) => !s.customBgUrl")
    assert app.evaluate("(s) => s.awaitedBgName") == "holiday.png", "it stopped waiting"
    app.select(template="example-1-corner-bug", fmt="16:9")
    assert app.framing["zoom"] == 3


def test_accepting_takes_the_picture_and_drops_the_framing(app, picture, other_picture, tmp_path):
    _saved_without_picture(app, picture, tmp_path)
    app.set_background(other_picture, expect_warning=True)

    app.answer_background_warning(True)

    assert app.evaluate("(s) => s.bgMode") == "custom"
    assert app.evaluate("(s) => s.bgName") == "a-different-picture.png"
    assert app.evaluate("(s) => s.awaitedBgName") == ""
    assert app.all_framing == {}, "the framing of the old picture was kept"


def test_the_awaited_picture_is_not_asked_about(app, picture, tmp_path):
    _saved_without_picture(app, picture, tmp_path)

    app.set_background(picture)

    assert app.background_warning is None
    app.select(template="example-1-corner-bug", fmt="16:9")
    assert app.framing["zoom"] == 3


def test_the_same_name_in_another_case_is_the_same_picture(app, picture, picture_renamed, tmp_path):
    """File names are compared the way a file system compares them."""
    _saved_without_picture(app, picture, tmp_path)

    app.set_background(picture_renamed)

    assert app.background_warning is None
    app.select(template="example-1-corner-bug", fmt="16:9")
    assert app.framing["zoom"] == 3


def test_replacing_a_picture_that_is_on_screen_is_not_asked_about(app, picture, other_picture):
    """Nothing is waiting, and the picture being replaced is in plain sight."""
    app.select(template="example-1-corner-bug", fmt="16:9")
    app.set_background(picture)
    app.zoom_background(3)

    app.set_background(other_picture)

    assert app.background_warning is None
    assert app.all_framing == {}


def test_a_setup_without_a_background_clears_the_one_in_place(app, picture, tmp_path):
    """An import replaces the whole setup, background included."""
    plain = tmp_path / "plain.json"
    app.select(template="example-1-corner-bug")
    plain.write_text(app.export_config(), encoding="utf-8")

    app.set_background(picture)
    assert app.evaluate("(s) => s.bgMode") == "custom"

    app.import_setup(plain)

    assert app.evaluate("(s) => s.bgMode") != "custom"
    assert app.evaluate("(s) => !s.customBgUrl")


def test_a_setup_from_before_backgrounds_leaves_the_one_in_place(app, picture, tmp_path):
    """No key at all means the file predates this, not that it wants none."""
    app.select(template="example-1-corner-bug")
    setup = json.loads(app.export_config())
    del setup["background"]
    older = tmp_path / "older.json"
    older.write_text(json.dumps(setup), encoding="utf-8")

    app.set_background(picture)
    app.import_setup(older)

    assert app.evaluate("(s) => s.bgMode") == "custom"


def test_the_stored_setup_never_carries_the_picture(app, picture):
    """localStorage is written as one string - an oversized value loses it all."""
    app.select(template="example-1-corner-bug")
    app.set_background(picture)
    app.zoom_background(2)
    app.evaluate("(s) => s.flushSave()")

    stored = app.page.evaluate("() => localStorage.getItem('wasdcat_bkg_setup')")
    payload = json.loads(stored)

    assert "image" not in payload["background"]
    assert payload["background"]["framing"], "the framing has to be stored"
    assert len(stored) < 100_000, f"the stored setup grew to {len(stored)} characters"


def test_the_picture_survives_a_restart(app, picture):
    """What the asset store is for: localStorage cannot hold a photograph."""
    app.select(template="example-1-corner-bug", fmt="16:9")
    app.set_background(picture)
    app.zoom_background(3)
    app.evaluate("(s) => s.flushSave()")

    app.reload()

    assert app.evaluate("(s) => s.bgMode") == "custom", "the picture did not come back"
    assert app.evaluate("(s) => !!s.customBgUrl")
    assert app.evaluate("(s) => s.awaitedBgName") == "", "it is still being waited for"
    app.select(template="example-1-corner-bug", fmt="16:9")
    assert app.framing["zoom"] == 3, "the framing did not come back with it"


def test_a_removed_picture_stays_gone_after_a_restart(app, picture):
    app.select(template="example-1-corner-bug")
    app.set_background(picture)
    app.remove_background()
    app.evaluate("(s) => s.flushSave()")

    app.reload()

    assert app.evaluate("(s) => s.bgMode") != "custom"
    assert app.evaluate("(s) => !s.customBgUrl")


def test_a_setup_that_is_not_an_image_is_refused(app, tmp_path):
    """A setup file can come from anywhere and its value ends up in an img src."""
    app.select(template="example-1-corner-bug")
    setup = json.loads(app.export_config())
    setup["background"] = {"name": "x", "framing": {}, "image": "javascript:alert(1)"}
    hostile = tmp_path / "hostile.json"
    hostile.write_text(json.dumps(setup), encoding="utf-8")

    app.import_setup(hostile)

    assert app.evaluate("(s) => s.customBgUrl") is None
    assert app.evaluate("(s) => s.bgMode") != "custom"


def test_nonsense_framing_is_dropped_rather_than_applied(app, picture, tmp_path):
    app.select(template="example-1-corner-bug", fmt="16:9")
    app.set_background(picture)
    app.zoom_background(2)
    setup = json.loads(app.export_config(with_image=True))
    setup["background"]["framing"] = {
        "example-1-corner-bug": {
            "16:9": {"x": "nonsense", "y": 0, "zoom": 2},
            "3:2": {"x": 0, "y": 0, "zoom": 2},
        }
    }
    broken = tmp_path / "broken.json"
    broken.write_text(json.dumps(setup), encoding="utf-8")

    app.reset()
    app.import_setup(broken)

    assert app.all_framing == {}, "an unusable row or an unknown format got through"


def test_an_outsized_zoom_is_brought_into_range(app, picture, tmp_path):
    app.select(template="example-1-corner-bug", fmt="16:9")
    app.set_background(picture)
    app.zoom_background(2)
    setup = json.loads(app.export_config(with_image=True))
    setup["background"]["framing"]["example-1-corner-bug"]["16:9"]["zoom"] = 9999
    broken = tmp_path / "zoom.json"
    broken.write_text(json.dumps(setup), encoding="utf-8")

    app.reset()
    app.import_setup(broken)

    app.select(template="example-1-corner-bug", fmt="16:9")
    assert app.framing["zoom"] == 6, "the zoom was not brought back into range"
