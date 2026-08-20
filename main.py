# -*- coding: utf-8 -*-
import argparse
import os
import re
import tomllib
from pathlib import Path

import markdown
from feedgen.feed import FeedGenerator
from github import Github
from lxml.etree import CDATA
from marko.ext.gfm import gfm as marko

BACKUP_DIR = "BACKUP"
CONFIG_FILE = "config.toml"
ANCHOR_NUMBER = 5

# 新的标签配置
TOP_ISSUES_LABELS = ["Top"]
RECOMMEND_LABELS = ["Recommendations"]
FRIENDS_LABELS = ["Friends"]
ABOUT_LABELS = ["About"]
THINGS_LABELS = ["Things"]
TODO_ISSUES_LABELS = ["TODO"]

CUSTOM_CATEGORIES = {
    "🤓 计算机基础": [
        # 操作系统
        "OS", "OS-Linux", "OS-Memory", "OS-Network",
        # 数据库
        "DB", "DB-SQL", "DB-NoSQL", "DB-Optimization", "DB-Design", "DB-Transaction",
        # 分布式系统
        "Distributed-System", "Distributed-Consensus", "Cloud-Native",
        # 网络
        "Network", "Network-Protocol",
        # 数据结构和算法
        "Algorithm", "Data-Structure", "LeetCode", "Coding-Interview"
    ],
    "🎭 开发技术": [
        "Tech", "Programming", "Go", "Python", "C",
        "Web-Dev", "Backend", 
        "Tools", "IDE", "Productivity",
        "DevOps", "Docker", "Kubernetes", "CI-CD"
    ],
    "🧭 生活随笔": ["Life", "Daily-Life", "Thoughts", "Reading", "Travel", "Photography"]
}

IGNORE_LABELS = (
    FRIENDS_LABELS
    + TOP_ISSUES_LABELS
    + RECOMMEND_LABELS
    + TODO_ISSUES_LABELS
    + ABOUT_LABELS
    + THINGS_LABELS
)

FRIENDS_TABLE_HEAD = "| Name | Link | Desc | \n | ---- | ---- | ---- |\n"
FRIENDS_TABLE_TEMPLATE = "| {name} | {link} | {desc} |\n"
FRIENDS_INFO_DICT = {
    "名字": "",
    "链接": "",
    "描述": "",
}


def load_site_config(filename=CONFIG_FILE):
    """Load the shared Zola/blog configuration with safe local defaults."""
    defaults = {
        "title": "DailyBlog",
        "description": "My personal blog",
        "base_url": "https://zhonghe-zhao.github.io/DailyBlog/",
        "author": "Zhonghe-zhao",
        "repository": "Zhonghe-zhao/DailyBlog",
        "repository_branch": "main",
        "motto": "Time has always been with me.",
    }
    path = Path(filename)
    if not path.exists():
        return defaults

    with path.open("rb") as config_file:
        raw = tomllib.load(config_file)

    extra = raw.get("extra", {})
    return {
        **defaults,
        "title": raw.get("title", defaults["title"]),
        "description": raw.get("description", defaults["description"]),
        "base_url": raw.get("base_url", defaults["base_url"]).rstrip("/") + "/",
        "author": extra.get("author", defaults["author"]),
        "repository": extra.get("repository", defaults["repository"]),
        "repository_branch": extra.get(
            "repository_branch", defaults["repository_branch"]
        ),
        "motto": extra.get("motto", defaults["motto"]),
    }


def build_md_header(repo_name, config):
    base_url = config["base_url"]
    return (
        f"## [{config['title']}]({base_url})\n"
        f"> {config['motto']}\n\n"
        f"[About Me](https://github.com/{repo_name}/issues/34) · "
        f"[Things I like](https://github.com/{repo_name}/issues/35) · "
        f"[RSS Feed]({base_url}rss.xml)\n"
    )


def issue_label_names(issue):
    return {label.name for label in issue.labels}


def is_regular_post(issue):
    """Exclude Issues used as site data rather than published articles."""
    return not issue_label_names(issue).intersection(IGNORE_LABELS)


def get_me(user):
    return user.get_user().login


def is_me(issue, me):
    return issue.user.login == me


def is_hearted_by_me(comment, me):
    reactions = list(comment.get_reactions())
    for r in reactions:
        if r.content == "heart" and r.user.login == me:
            return True
    return False


def _make_friend_table_string(s):
    info_dict = FRIENDS_INFO_DICT.copy()
    try:
        string_list = s.splitlines()
        # drop empty line
        string_list = [l for l in string_list if l and not l.isspace()]
        for l in string_list:
            string_info_list = re.split("：", l)
            if len(string_info_list) < 2:
                continue
            info_dict[string_info_list[0]] = string_info_list[1]
        return FRIENDS_TABLE_TEMPLATE.format(
            name=info_dict["名字"], link=info_dict["链接"], desc=info_dict["描述"]
        )
    except Exception as e:
        print(str(e))
        return


def _valid_xml_char_ordinal(c):
    codepoint = ord(c)
    return (
        0x20 <= codepoint <= 0xD7FF
        or codepoint in (0x9, 0xA, 0xD)
        or 0xE000 <= codepoint <= 0xFFFD
        or 0x10000 <= codepoint <= 0x10FFFF
    )


def format_time(time):
    return str(time)[:10]


def login(token):
    return Github(token)


def get_repo(user: Github, repo: str):
    return user.get_repo(repo)


def parse_TODO(issue):
    body = (issue.body or "").splitlines()
    todo_undone = [line for line in body if re.match(r"^- \[ \] ", line)]
    todo_done = [line for line in body if re.match(r"^- \[[xX]\] ", line)]
    if not todo_undone:
        return f"[{issue.title}]({issue.html_url}) all done", []
    return (
        f"[{issue.title}]({issue.html_url})--{len(todo_undone)} jobs to do--{len(todo_done)} jobs done",
        todo_done + todo_undone,
    )


def get_top_issues(repo):
    return repo.get_issues(labels=TOP_ISSUES_LABELS)


def get_todo_issues(repo):
    return repo.get_issues(labels=TODO_ISSUES_LABELS)


def get_repo_labels(repo):
    return [l for l in repo.get_labels()]


def get_issues_from_label(repo, label):
    return repo.get_issues(labels=(label,))


def add_issue_info(issue, md):
    time = format_time(issue.created_at)
    md.write(f"- [{issue.title}]({issue.html_url})--{time}\n")


def add_md_todo(repo, md, me):
    todo_issues = list(get_todo_issues(repo))
    if not TODO_ISSUES_LABELS or not todo_issues:
        return
    with open(md, "a+", encoding="utf-8") as md:
        md.write("## TODO\n")
        for issue in todo_issues:
            if is_me(issue, me):
                todo_title, todo_list = parse_TODO(issue)
                md.write("TODO list from " + todo_title + "\n")
                for t in todo_list:
                    md.write(t + "\n")
                md.write("\n")


def add_md_top(repo, md, me):
    top_issues = list(get_top_issues(repo))
    if not TOP_ISSUES_LABELS or not top_issues:
        return
    with open(md, "a+", encoding="utf-8") as md:
        md.write("## 🦄 置顶文章\n")
        for issue in top_issues:
            if is_me(issue, me):
                add_issue_info(issue, md)


def add_md_friends(repo, md, me):
    s = FRIENDS_TABLE_HEAD
    friends_issues = list(repo.get_issues(labels=FRIENDS_LABELS))
    if not FRIENDS_LABELS or not friends_issues:
        return
    friends_issue_number = friends_issues[0].number
    for issue in friends_issues:
        for comment in issue.get_comments():
            if is_hearted_by_me(comment, me):
                try:
                    s += _make_friend_table_string(comment.body or "")
                except Exception as e:
                    print(str(e))
                    pass
    # Avoid rendering a misleading empty row when no friend has been approved yet.
    if s == FRIENDS_TABLE_HEAD:
        return
    s = markdown.markdown(s, output_format="html", extensions=["extra"])
    with open(md, "a+", encoding="utf-8") as md:
        md.write(
            f"## [友情链接](https://github.com/{str(me)}/DailyBlog/issues/{friends_issue_number})\n"
        )
        md.write("<details><summary>显示</summary>\n")
        md.write(s)
        md.write("</details>\n")
        md.write("\n\n")


def add_md_recent(repo, md, me, limit=10):
    """显示最近更新的文章"""
    count = 0
    with open(md, "a+", encoding="utf-8") as md:
        md.write("## 📖 最近更新\n")
        try:
            for issue in repo.get_issues(sort="updated", direction="desc"):
                if (
                    is_me(issue, me)
                    and not issue.pull_request
                    and is_regular_post(issue)
                ):
                    add_issue_info(issue, md)
                    count += 1
                    if count >= limit:
                        break
        except Exception as e:
            print(str(e))


def add_md_header(md, repo_name, config):
    with open(md, "w", encoding="utf-8") as md:
        md.write(build_md_header(repo_name, config))
        md.write("\n")

def add_md_weekly_recommendations(repo, md, me):
    """从单一issue中提取推荐内容"""

    recommend_issues = list(repo.get_issues(labels=RECOMMEND_LABELS))
    if not recommend_issues:
        return
        
    recommend_issue = recommend_issues[0]
    
    with open(md, "a+", encoding="utf-8") as md_file:
        md_file.write("## 📰 推荐阅读\n\n")
        md_file.write("> 精选优质技术文章与深度思考\n\n")
        md_file.write("<details>\n<summary><b>展开推荐列表</b></summary>\n\n")
        
      
        recommendations = parse_recommendations(recommend_issue.body or "")
        
        for date, title, content, link in recommendations[:5]:  
            md_file.write(f"**{date}** - [{title}]({link})\n")
            preview = content[:100] + "..." if len(content) > 100 else content
            md_file.write(f"> {preview}\n\n")
        
        md_file.write(f"</details>\n\n")
        md_file.write(f"*[直达issue]({recommend_issue.html_url})*\n\n")

def parse_recommendations(content):
    """Parse both current and legacy recommendation heading formats."""
    recommendations = []
    lines = content.splitlines()
    current_date = ""

    date_pattern = re.compile(r"^##\s+(\d{4}-\d{2}-\d{2})(?:\s*日?推荐)?\s*$")
    link_pattern = re.compile(r"^\[(.+?)\]\((https?://[^\s)]+)\)\s*$")

    for i, line in enumerate(lines):
        line = line.strip()

        date_match = date_pattern.match(line)
        if date_match:
            current_date = date_match.group(1)
            continue

        link_match = link_pattern.match(line)
        if not (link_match and current_date):
            continue

        current_content = []
        idx = i + 1
        while idx < len(lines):
            next_line = lines[idx].strip()
            if date_pattern.match(next_line) or link_pattern.match(next_line):
                break
            if next_line and not next_line.startswith("#"):
                current_content.append(next_line.removeprefix("> ").strip('"'))
            idx += 1

        recommendations.append(
            (
                current_date,
                link_match.group(1),
                " ".join(current_content).strip(),
                link_match.group(2),
            )
        )

    recommendations.sort(key=lambda x: x[0], reverse=True)
    return recommendations


def add_md_custom_categories(repo, md, me):
    """使用自定义分类显示文章"""
    try:
        owned_issues = [
            issue
            for issue in repo.get_issues(sort="created", direction="desc")
            if is_me(issue, me) and not issue.pull_request and is_regular_post(issue)
        ]
    except Exception as error:
        print(f"Error getting issues for categories: {error}")
        return

    with open(md, "a+", encoding="utf-8") as md:
        for category_name, labels in CUSTOM_CATEGORIES.items():
            label_set = set(labels)
            category_issues = [
                issue
                for issue in owned_issues
                if issue_label_names(issue).intersection(label_set)
            ]
            category_issues.sort(key=lambda x: x.created_at, reverse=True)
            
            if category_issues:
                md.write(f"## {category_name}\n\n")
                
                # 显示文章，超过5篇时折叠
                for i, issue in enumerate(category_issues):
                    if i == 5:  # 只显示5篇，更多内容折叠
                        md.write("<details><summary>显示更多</summary>\n\n")
                    
                    time = format_time(issue.created_at)
                    md.write(f"- [{issue.title}]({issue.html_url}) - {time}\n")
                
                if len(category_issues) > 5:
                    md.write("</details>\n")
                
                md.write("\n")


def get_to_generate_issues(repo, dir_name, issue_number=None):
    """获取需要生成的issues"""
    print(f"Checking issues to generate, issue_number: {issue_number}")
    
    # 如果明确指定了issue_number，只处理这个issue
    if issue_number and issue_number != 'None' and issue_number != '':
        print(f"Processing specific issue: {issue_number}")
        try:
            return [repo.get_issue(int(issue_number))]
        except Exception as e:
            print(f"Error getting issue {issue_number}: {e}")
    
    # 确保备份目录存在
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)
        print(f"Created backup directory: {dir_name}")

    # A manual run is a full reconciliation, so edits and deleted comments are
    # reflected even when a previous event did not complete successfully.
    all_issues = list(repo.get_issues())
    print(f"Total issues in repo: {len(all_issues)}")

    print(f"Issues to generate: {len(all_issues)}")
    return all_issues


def generate_rss_feed(repo, filename, me, config):
    generator = FeedGenerator()
    generator.id(config["base_url"])
    generator.title(config["title"])
    generator.description(config["description"])
    generator.author(
        {
            "name": os.getenv("GITHUB_NAME", config["author"]),
            "email": os.getenv("GITHUB_EMAIL", "noreply@github.com"),
        }
    )
    generator.link(href=config["base_url"])
    generator.link(
        href=(
            f"https://raw.githubusercontent.com/{repo.full_name}/"
            f"{config['repository_branch']}/{filename}"
        ),
        rel="self",
    )
    for issue in repo.get_issues(sort="updated", direction="desc"):
        if (
            not issue.body
            or not is_me(issue, me)
            or issue.pull_request
            or not is_regular_post(issue)
        ):
            continue
        item = generator.add_entry(order="append")
        item.id(issue.html_url)
        item.link(href=issue.html_url)
        item.title(issue.title)
        item.published(issue.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"))
        item.updated(issue.updated_at.strftime("%Y-%m-%dT%H:%M:%SZ"))
        for label in issue.labels:
            item.category({"term": label.name})
        body = "".join(c for c in issue.body if _valid_xml_char_ordinal(c))
        item.content(CDATA(marko.convert(body)), type="html")
    generator.rss_file(filename)


def save_issue(issue, me, dir_name=BACKUP_DIR):
    """保存issue到BACKUP文件夹"""
    os.makedirs(dir_name, exist_ok=True)
    # 清理文件名中的非法字符
    safe_title = re.sub(r'[<>:"/\\|?*]', "-", issue.title).strip().rstrip(".")
    safe_title = safe_title[:120] or "untitled"
    md_name = os.path.join(dir_name, f"{issue.number}_{safe_title}.md")

    print(f"Saving issue #{issue.number} to {md_name}")

    # The Issue number is stable while its title is editable. Remove obsolete
    # files for the same number to prevent duplicate posts after a rename.
    prefix = f"{issue.number}_"
    for old_name in os.listdir(dir_name):
        old_path = os.path.join(dir_name, old_name)
        if (
            old_name.startswith(prefix)
            and old_path != md_name
            and os.path.isfile(old_path)
        ):
            os.remove(old_path)

    temp_name = f"{md_name}.tmp"
    with open(temp_name, "w", encoding="utf-8") as f:
        f.write(f"# [{issue.title}]({issue.html_url})\n\n")
        f.write(issue.body or "")
        if issue.comments:
            for c in issue.get_comments():
                if is_me(c, me):
                    f.write("\n\n---\n\n")
                    f.write(c.body or "")
    os.replace(temp_name, md_name)


def main(token, repo_name, issue_number=None, dir_name=BACKUP_DIR):
    """主函数"""
    print("=== Script Started ===")
    print(f"Repo: {repo_name}")
    print(f"Issue Number: {issue_number}")
    
    user = login(token)
    me = get_me(user)
    repo = get_repo(user, repo_name)
    config = load_site_config()
    
    print(f"Me: {me}")
    print(f"Repo full name: {repo.full_name}")
    
    # 确保BACKUP目录存在
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)
        print(f"Created backup directory: {dir_name}")
    
    # 生成README
    add_md_header("README.md", repo_name, config)
    
    # 按这个顺序显示
    readme_sections = [
        add_md_top,
        add_md_weekly_recommendations,
        add_md_recent,
        add_md_friends,
        add_md_custom_categories,
        add_md_todo,
    ]
    for func in readme_sections:
        func(repo, "README.md", me)

    generate_rss_feed(repo, "feed.xml", me, config)

    # 备份issues到BACKUP文件夹
    to_generate_issues = get_to_generate_issues(repo, dir_name, issue_number)

    # 保存md文件到backup文件夹
    for issue in to_generate_issues:
        print(f"Processing issue #{issue.number}: {issue.title}")
        save_issue(issue, me, dir_name)
    
    print("=== Script Completed ===")


if __name__ == "__main__":
    if not os.path.exists(BACKUP_DIR):
        os.mkdir(BACKUP_DIR)
    parser = argparse.ArgumentParser()
    parser.add_argument("github_token", help="github_token")
    parser.add_argument("repo_name", help="repo_name")
    parser.add_argument(
        "--issue_number", help="issue_number", default=None, required=False
    )
    options = parser.parse_args()
    main(options.github_token, options.repo_name, options.issue_number)
