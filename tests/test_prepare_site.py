import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).parents[1] / "scripts" / "prepare_site.py"
SPEC = importlib.util.spec_from_file_location("prepare_site", SCRIPT)
prepare_site = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(prepare_site)


class ImageExtractionTests(unittest.TestCase):
    def test_extracts_markdown_and_html_images_in_source_order(self):
        body = '''![第一张](https://example.com/a.jpg)
text
<img width="10" alt="第二张" src="https://example.com/b.png">
![duplicate](https://example.com/a.jpg)
'''
        self.assertEqual(
            prepare_site.extract_images(body),
            [
                {"src": "https://example.com/a.jpg", "alt": "第一张"},
                {"src": "https://example.com/b.png", "alt": "第二张"},
            ],
        )

    def test_build_adds_cover_and_gallery_json(self):
        # isite v0.2.6 emits a leading newline before the TOML delimiter.
        source = '''
+++
title = "一篇文章"
date = 2026-08-21
[extra]
issue_url = "https://github.com/example/issues/8"
+++
开头
![Image](https://example.com/cover.webp)
'''
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            (output / "content").mkdir()
            article = output / "content" / "issue-8.md"
            article.write_text(source, encoding="utf-8")

            items = prepare_site.prepare_site(output)
            enriched = article.read_text(encoding="utf-8")
            generated = json.loads((output / "static" / "gallery.json").read_text(encoding="utf-8"))

        self.assertIn('cover = "https://example.com/cover.webp"', enriched)
        self.assertEqual(items, generated)
        self.assertEqual(items[0]["title"], "一篇文章")
        self.assertEqual(items[0]["date"], "2026-08-21")
        self.assertEqual(items[0]["href"], "/issue-8/")


if __name__ == "__main__":
    unittest.main()
