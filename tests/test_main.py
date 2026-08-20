import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from types import SimpleNamespace

import main


def issue(**overrides):
    values = {
        "number": 12,
        "title": "A title",
        "html_url": "https://github.com/example/blog/issues/12",
        "body": "Body",
        "labels": [],
        "comments": 0,
        "get_comments": lambda: [],
    }
    values.update(overrides)
    return SimpleNamespace(**values)


class ConfigTests(unittest.TestCase):
    def test_shared_config_uses_canonical_domain_and_branch(self):
        config = main.load_site_config()
        self.assertEqual(config["base_url"], "https://blog.zhaozhonghe.me/")
        self.assertEqual(config["repository_branch"], "main")

    def test_readme_header_links_to_site_feed(self):
        config = main.load_site_config()
        header = main.build_md_header("owner/repo", config)
        self.assertIn("https://blog.zhaozhonghe.me/rss.xml", header)
        self.assertNotIn("/master/", header)


class ContentParsingTests(unittest.TestCase):
    def test_recommendations_support_legacy_and_current_dates(self):
        content = """
## 2026-08-20
[New format](https://example.com/new)

> A useful summary.

## 2025-08-12日推荐
[Legacy format](https://example.com/old)
Another summary.
"""
        items = main.parse_recommendations(content)
        self.assertEqual([item[0] for item in items], ["2026-08-20", "2025-08-12"])
        self.assertEqual(items[0][2], "A useful summary.")

    def test_todo_accepts_uppercase_checked_marker(self):
        title, items = main.parse_TODO(
            issue(body="- [X] shipped\n- [ ] next", title="Roadmap")
        )
        self.assertIn("1 jobs to do", title)
        self.assertEqual(items, ["- [X] shipped", "- [ ] next"])

    def test_site_data_issues_are_not_regular_posts(self):
        recommendation = issue(
            labels=[SimpleNamespace(name=main.RECOMMEND_LABELS[0])]
        )
        article = issue(labels=[SimpleNamespace(name="Tech")])
        self.assertFalse(main.is_regular_post(recommendation))
        self.assertTrue(main.is_regular_post(article))


class BackupTests(unittest.TestCase):
    def test_renaming_issue_removes_obsolete_backup(self):
        with tempfile.TemporaryDirectory() as directory:
            old_path = Path(directory, "12_Old title.md")
            old_path.write_text("old", encoding="utf-8")

            main.save_issue(issue(title="New title"), "author", directory)

            self.assertFalse(old_path.exists())
            new_path = Path(directory, "12_New title.md")
            self.assertTrue(new_path.exists())
            self.assertIn("Body", new_path.read_text(encoding="utf-8"))


class FeedTests(unittest.TestCase):
    def test_feed_is_rss_and_uses_main_branch(self):
        published = issue(
            user=SimpleNamespace(login="author"),
            pull_request=None,
            created_at=datetime(2026, 8, 20, tzinfo=timezone.utc),
            updated_at=datetime(2026, 8, 21, tzinfo=timezone.utc),
        )
        repo = SimpleNamespace(
            full_name="owner/repo",
            get_issues=lambda **kwargs: [published],
        )
        config = main.load_site_config()

        with tempfile.TemporaryDirectory() as directory:
            feed_path = Path(directory, "feed.xml")
            main.generate_rss_feed(repo, str(feed_path), "author", config)
            xml = feed_path.read_text(encoding="utf-8")

        self.assertIn("<rss", xml)
        self.assertIn("owner/repo/main", xml)
        self.assertNotIn("owner/repo/master", xml)


if __name__ == "__main__":
    unittest.main()
