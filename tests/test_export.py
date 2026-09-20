"""The export itself: single PNG, ZIP package and the background composite.

Every check goes through the buttons and reads back the file the browser would
have saved, so what is asserted here is what lands in someone's downloads
folder.
"""

import io
import json
import zipfile

import pytest

from pixels import diff_bbox, ink_count, open_png

def test_the_catalogue_loads_without_a_broken_template(catalogue):
    assert catalogue["templates"], "no template was found"
    broken = {t["id"]: t["error"] for t in catalogue["templates"] if t["error"]}
    assert not broken, f"templates that will not render: {broken}"


def test_every_template_exports_every_format(app, template_id, format_id):
    """The matrix: a PNG of the right size with something drawn on it."""
    sizes = {f["id"]: (f["width"], f["height"]) for f in app.formats}
    app.select(template=template_id, fmt=format_id)
    png = app.export_png()

    image = open_png(png)
    assert image.size == sizes[format_id]
    assert ink_count(image) > 1000, "the export came out blank"


def test_an_export_without_a_background_stays_transparent(app):
    app.select(template="example-3-title-card", fmt="16:9")
    image = open_png(app.export_png())

    assert image.getpixel((5, 5))[3] == 0, "the top left corner is not transparent"
    assert image.getchannel("A").getextrema()[1] == 255, "nothing is fully drawn"


def test_the_filename_names_the_combination(app):
    app.select(template="example-3-title-card", fmt="16:9")
    app.export_png()

    assert app.last_filename.endswith("_16x9.png")
    assert "example_3_title_card" in app.last_filename


def test_the_content_of_a_post_reaches_the_export(app):
    """Changing a field has to change the picture."""
    app.select(template="example-3-title-card", fmt="16:9", title="Episode #42")
    first = app.export_png(capture=True)
    box = app.drawn("title")["box"]

    app.select(title="Chapter #17")
    second = app.export_png()

    assert diff_bbox(first, second, box) is not None


def test_an_empty_placeholder_leaves_no_ink(app):
    """An empty tag disappears rather than showing an empty chip."""
    app.select(template="example-3-title-card", fmt="16:9", tag="PODCAST #42", tag2="UPDATE")
    with_tags = app.export_png(capture=True)
    box = app.drawn("tag2")["box"]
    assert box["width"] > 0

    app.select(tag2="")
    without_tags = app.export_png(capture=True)

    assert app.drawn("tag2")["box"]["width"] == 0, "the empty tag still takes up room"
    # The title card lays a scrim over the whole lower half, so counting drawn
    # pixels says nothing here - what settles it is that the chip's own ink went.
    assert diff_bbox(with_tags, without_tags, box) is not None, (
        "the empty tag is still drawn"
    )


# -- ZIP package ----------------------------------------------------------


def test_the_zip_holds_one_png_per_selected_format(app):
    app.select(template="example-3-title-card")
    selected = app.evaluate("(s) => s.selectedFormats")
    sizes = {f["id"]: (f["width"], f["height"]) for f in app.formats}

    archive = zipfile.ZipFile(io.BytesIO(app.export_zip()))
    names = [n for n in archive.namelist() if n.endswith(".png")]
    assert len(names) == len(selected)

    for format_id in selected:
        suffix = f"_{format_id.replace(':', 'x')}.png"
        matching = [n for n in names if n.endswith(suffix)]
        assert len(matching) == 1, f"{format_id} is missing from the archive"
        image = open_png(archive.read(matching[0]))
        assert image.size == sizes[format_id]
        assert ink_count(image) > 1000, f"{format_id} came out blank"


def test_the_zip_follows_the_format_selection(app):
    app.select(template="example-3-title-card")
    app.evaluate("(s) => { s.selectedFormats = ['1:1', '16:9']; }")

    names = [
        n for n in zipfile.ZipFile(io.BytesIO(app.export_zip())).namelist() if n.endswith(".png")
    ]

    assert len(names) == 2
    assert any(n.endswith("_1x1.png") for n in names)
    assert any(n.endswith("_16x9.png") for n in names)


def test_a_zip_without_a_format_is_refused(app):
    app.select(template="example-3-title-card")
    app.evaluate("(s) => { s.selectedFormats = []; }")
    app.evaluate("(s) => s.exportZipPackage()")

    assert app.toast["message"] == app.translate("msg.pickFormat")
    assert not app.evaluate("(s) => s.isExporting")


def test_the_zip_carries_a_setup_that_imports_back(app, tmp_path):
    """The archive is meant to be a complete handover, so it has to load again."""
    app.select(template="example-3-title-card", title="Episode #42", subtitle="Guest: A. Vance")
    archive = zipfile.ZipFile(io.BytesIO(app.export_zip()))
    entry = next(n for n in archive.namelist() if n.endswith("brand-setup.json"))
    setup = json.loads(archive.read(entry))

    assert setup["id"] == "wasdcat-bkg-config"
    assert setup["content"]["title"] == "Episode #42"

    saved = tmp_path / "brand-setup.json"
    saved.write_bytes(archive.read(entry))
    app.reset()
    assert app.evaluate("(s) => s.content.title") != "Episode #42"

    app.import_setup(saved)

    assert app.evaluate("(s) => s.content.title") == "Episode #42"
    assert app.evaluate("(s) => s.content.subtitle") == "Guest: A. Vance"


def test_the_saved_configuration_matches_the_one_in_the_zip(app):
    app.select(template="example-3-title-card", title="Episode #42")
    from_button = json.loads(app.export_config())
    archive = zipfile.ZipFile(io.BytesIO(app.export_zip()))
    entry = next(n for n in archive.namelist() if n.endswith("brand-setup.json"))
    from_zip = json.loads(archive.read(entry))

    from_button.pop("exportedAt")
    from_zip.pop("exportedAt")
    assert from_button == from_zip


def test_the_saved_configuration_filename_uses_the_company_name(app):
    app.export_config()
    assert app.last_filename == "your_company_brandkit_config.json"

    app.evaluate("(s) => { s.company.name = 'WASDCAT'; }")
    app.export_config()
    assert app.last_filename == "wasdcat_brandkit_config.json"

    app.evaluate("(s) => { s.company.name = 'Acme Studios'; }")
    app.export_config()
    assert app.last_filename == "acme_studios_brandkit_config.json"

    app.evaluate("(s) => { s.company.name = ''; }")
    app.export_config()
    assert app.last_filename == "brand_brandkit_config.json"


def test_the_export_stage_never_changes_the_preview_format(app):
    """A ZIP walks every format; the preview must stay where it was."""
    app.select(template="example-3-title-card", fmt="9:16")
    app.export_zip()

    assert app.evaluate("(s) => s.currentFormat.id") == "9:16"


# -- status text ----------------------------------------------------------


@pytest.mark.parametrize("language", ["en", "de"])
def test_the_export_status_is_shown_in_the_interface_language(app, language):
    """The three messages during an export used to be written into the source."""
    app.select(template="example-1-corner-bug", language=language)
    seen = app.evaluate(
        """async (s) => {
            const running = s.exportSinglePNG();
            const text = s.exportStatusText;
            await running;
            return text;
        }"""
    )

    assert seen == app.translate("ex.statusPng", lang=language)
