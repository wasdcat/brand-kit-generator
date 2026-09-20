"""Reading an exported PNG back.

Two questions come up: is anything drawn in this region, and does what is drawn
there follow the text. The first is a matter of the alpha channel. The second
is answered by rendering the same frame twice with different wording and
looking at where the two differ - which needs no knowledge of colour sets,
scrims or background images, and does not care that font hinting differs from
one machine to the next.
"""

from __future__ import annotations

import io

from PIL import Image, ImageChops

INK = 16  # alpha above this counts as drawn
DIFFERENT = 24  # per-channel difference that counts as a different pixel


def open_png(data: bytes) -> Image.Image:
    return Image.open(io.BytesIO(data)).convert("RGBA")


def _region(image: Image.Image, box):
    """Crops to an (x, y, width, height) box, clipped to the image."""
    if box is None:
        return image, (0, 0)
    left = max(0, int(box["x"]))
    top = max(0, int(box["y"]))
    right = min(image.width, int(box["x"] + box["width"]) + 1)
    bottom = min(image.height, int(box["y"] + box["height"]) + 1)
    if right <= left or bottom <= top:
        return None, (left, top)
    return image.crop((left, top, right, bottom)), (left, top)


def _offset(found, origin):
    if found is None:
        return None
    return (found[0] + origin[0], found[1] + origin[1], found[2] + origin[0], found[3] + origin[1])


def ink_bbox(image: Image.Image, box=None):
    """Bounding box of everything drawn, in image coordinates, or None."""
    region, origin = _region(image, box)
    if region is None:
        return None
    mask = region.getchannel("A").point(lambda value: 255 if value > INK else 0)
    return _offset(mask.getbbox(), origin)


def ink_count(image: Image.Image, box=None) -> int:
    """How many pixels are drawn, in the whole image or in one region."""
    region, _ = _region(image, box)
    if region is None:
        return 0
    return sum(region.getchannel("A").histogram()[INK + 1 :])


def _flatten(image: Image.Image) -> Image.Image:
    """Onto opaque black, so transparent pixels compare equal."""
    canvas = Image.new("RGBA", image.size, (0, 0, 0, 255))
    canvas.alpha_composite(image)
    return canvas.convert("RGB")


def diff_bbox(first: bytes, second: bytes, box=None):
    """Bounding box of where two exports differ, or None if they match.

    Used to find the glyphs of one placeholder: render the same frame with two
    different wordings and everything except that placeholder cancels out.
    """
    one, two = open_png(first), open_png(second)
    if one.size != two.size:
        raise AssertionError(f"different sizes: {one.size} and {two.size}")
    difference = ImageChops.difference(_flatten(one), _flatten(two))
    region, origin = _region(difference.convert("RGBA"), box)
    if region is None:
        return None
    mask = region.convert("L").point(lambda value: 255 if value > DIFFERENT else 0)
    return _offset(mask.getbbox(), origin)
