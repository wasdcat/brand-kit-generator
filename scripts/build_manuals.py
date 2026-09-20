#!/usr/bin/env python3
"""
Build script for Brand Kit Generator PDF manuals.

Generates both German and English PDF manuals using markpublish and places
them into src/docs/manual/ for offline availability inside the application.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

# Paths
ROOT_DIR = Path(__file__).resolve().parent.parent
DOCS_MANUAL_DIR = ROOT_DIR / "docs" / "manual"
TARGET_DIR = ROOT_DIR / "src" / "docs" / "manual"

EDITIONS = [
    {
        "lang": "de",
        "name": "Deutsch",
        "source_dir": DOCS_MANUAL_DIR / "de",
        "config_file": "markpublish.yaml",
        "output_file": TARGET_DIR / "brand_kit_generator_de.pdf",
    },
    {
        "lang": "en",
        "name": "English",
        "source_dir": DOCS_MANUAL_DIR / "en",
        "config_file": "markpublish.yaml",
        "output_file": TARGET_DIR / "brand_kit_generator_en.pdf",
    },
]


def find_markpublish() -> str | None:
    """Find markpublish executable in PATH or user scripts."""
    executable = shutil.which("markpublish")
    if executable:
        return executable

    # Check Windows Python Scripts folder
    user_base = Path(os.path.expanduser("~"))
    candidates = list(user_base.glob("AppData/Local/Python/python*/Scripts/markpublish.exe")) + list(
        user_base.glob("AppData/Roaming/Python/Python*/Scripts/markpublish.exe")
    )
    if candidates:
        return str(candidates[0])

    return None


def build_manual(edition: dict, markpublish_cmd: str) -> bool:
    """Build a single manual edition."""
    source_dir: Path = edition["source_dir"]
    config_file: str = edition["config_file"]
    output_file: Path = edition["output_file"]
    lang: str = edition["lang"]
    name: str = edition["name"]

    print(f"\n[+] Building {name} manual ({lang})...")
    print(f"    Source: {source_dir / config_file}")
    print(f"    Output: {output_file}")

    if not (source_dir / config_file).exists():
        print(f"[-] Error: Configuration not found: {source_dir / config_file}", file=sys.stderr)
        return False

    output_file.parent.mkdir(parents=True, exist_ok=True)

    start_time = time.perf_counter()
    try:
        # Run markpublish build with relative output path from source_dir
        rel_output = os.path.relpath(output_file, start=source_dir)
        cmd = [markpublish_cmd, "build", "-o", rel_output]

        result = subprocess.run(cmd, cwd=source_dir, check=False)
        elapsed = time.perf_counter() - start_time

        if result.returncode != 0:
            print(f"[-] markpublish failed with exit code {result.returncode}", file=sys.stderr)
            return False

        if not output_file.exists():
            print(f"[-] Expected output file not found: {output_file}", file=sys.stderr)
            return False

        size_kb = output_file.stat().st_size / 1024
        print(f"[OK] {name} manual created in {elapsed:.2f}s ({size_kb:.1f} KB)")
        return True

    except Exception as exc:
        print(f"[-] Error building {name} manual: {exc}", file=sys.stderr)
        return False


def main() -> int:
    parser = argparse.ArgumentParser(description="Build Brand Kit Generator manuals (PDF).")
    parser.add_argument(
        "--lang",
        choices=["all", "de", "en"],
        default="all",
        help="Edition to build (default: all)",
    )
    args = parser.parse_args()

    markpublish_cmd = find_markpublish()
    if not markpublish_cmd:
        print(
            "[-] Error: 'markpublish' command not found. Please install markpublish or add it to PATH.",
            file=sys.stderr,
        )
        return 1

    templates_dir = DOCS_MANUAL_DIR / "templates"
    if templates_dir.is_dir() and "MARKPUBLISH_TEMPLATES_DIR" not in os.environ:
        os.environ["MARKPUBLISH_TEMPLATES_DIR"] = str(templates_dir)

    print(f"Using markpublish: {markpublish_cmd}")
    print(f"Project root:     {ROOT_DIR}")
    print(f"Output directory: {TARGET_DIR}")
    if templates_dir.is_dir():
        print(f"Templates dir:    {templates_dir}")

    selected_editions = [
        ed for ed in EDITIONS if args.lang == "all" or ed["lang"] == args.lang
    ]

    success_count = 0
    for edition in selected_editions:
        if build_manual(edition, markpublish_cmd):
            success_count += 1
        else:
            print(f"[-] Failed to build {edition['name']} manual.", file=sys.stderr)

    total = len(selected_editions)
    print(f"\nFinished: {success_count}/{total} manuals generated successfully.")
    return 0 if success_count == total else 1


if __name__ == "__main__":
    sys.exit(main())

