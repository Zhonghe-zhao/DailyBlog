"""Enrich isite's generated Markdown with covers and a gallery index.

The script intentionally uses only the Python standard library so it can run in
GitHub Actions without installing another toolchain.
"""

from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path


MARKDOWN_IMAGE = re.compile(r"!\[(?P<alt>[^\]]*)\]\((?P<url>https?://[^\s)]+)(?:\s+[\"'][^\"']*[\"'])?\)", re.I)
HTML_IMAGE = re.compile(r"<img\b(?P<attrs>[^>]*)>", re.I)
HTML_ATTRIBUTE = re.compile(r"(?P<name>src|alt)\s*=\s*([\"'])(?P<value>.*?)\2", re.I | re.S)


def extract_images(markdown: str) -> list[dict[str, str]]:
    """Return remote images in source order, de-duplicated by URL."""
    matches: list[tuple[int, str, str]] = []
    for match in MARKDOWN_IMAGE.finditer(markdown):
        matches.append((match.start(), match.group("url"), match.group("alt")))

    for match in HTML_IMAGE.finditer(markdown):
        attrs = {
            item.group("name").lower(): html.unescape(item.group("value").strip())
            for item in HTML_ATTRIBUTE.finditer(match.group("attrs"))
        }
        if attrs.get("src", "").startswith(("http://", "https://")):
            matches.append((match.start(), attrs["src"], attrs.get("alt", "")))

    result: list[dict[str, str]] = []
    seen: set[str] = set()
    for _, url, alt in sorted(matches):
        url = html.unescape(url)
        if url not in seen:
            seen.add(url)
            result.append({"src": url, "alt": html.unescape(alt).strip()})
    return result


def split_front_matter(text: str) -> tuple[str, str]:
    match = re.match(r"\A\+\+\+\r?\n(?P<front>.*?)\r?\n\+\+\+\r?\n?", text, re.S)
    if not match:
        raise ValueError("content does not start with TOML front matter")
    return match.group("front"), text[match.end():]


def front_value(front: str, key: str, default: str = "") -> str:
    match = re.search(rf"(?m)^{re.escape(key)}\s*=\s*(?P<value>.+?)\s*$", front)
    if not match:
        return default
    return match.group("value").strip().strip("\"'")


def add_cover(front: str, cover: str) -> str:
    encoded = json.dumps(cover, ensure_ascii=False)
    if re.search(r"(?m)^cover\s*=", front):
        return re.sub(r"(?m)^cover\s*=.*$", f"cover = {encoded}", front, count=1)
    extra = re.search(r"(?m)^\[extra\]\s*$", front)
    if extra:
        return front[: extra.end()] + f"\ncover = {encoded}" + front[extra.end():]
    return front.rstrip() + f"\n\n[extra]\ncover = {encoded}"


def prepare_site(output: Path) -> list[dict[str, str]]:
    content = output / "content"
    gallery: list[dict[str, str]] = []

    for path in sorted(content.glob("*.md")):
        if path.name.startswith("_") or path.stem == "gallery":
            continue
        original = path.read_text(encoding="utf-8")
        try:
            front, body = split_front_matter(original)
        except ValueError:
            continue

        images = extract_images(body)
        cover = images[0]["src"] if images else ""
        enriched = f"+++\n{add_cover(front, cover)}\n+++\n{body}"
        path.write_text(enriched, encoding="utf-8", newline="\n")

        title = front_value(front, "title", path.stem)
        date = front_value(front, "date")[:10]
        issue_url = front_value(front, "issue_url")
        for index, image in enumerate(images, start=1):
            gallery.append(
                {
                    **image,
                    "alt": image["alt"] or f"{title} · 图片 {index}",
                    "title": title,
                    "date": date,
                    "href": f"/{path.stem}/",
                    "issue_url": issue_url,
                }
            )

    static = output / "static"
    static.mkdir(parents=True, exist_ok=True)
    (static / "gallery.json").write_text(
        json.dumps(gallery, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
        newline="\n",
    )
    return gallery


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path, help="isite output directory")
    args = parser.parse_args()
    images = prepare_site(args.output)
    print(f"Prepared {len(images)} gallery images")


if __name__ == "__main__":
    main()
