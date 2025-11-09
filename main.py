# -*- coding: utf-8 -*-
import argparse
import os
import re

import markdown
from feedgen.feed import FeedGenerator
from github import Github
from lxml.etree import CDATA
from marko.ext.gfm import gfm as marko

MD_HEAD = """## [DailyBlog](https://Zhonghe-zhao.github.io/DailyBlog/)
My personal blog([About Me](https://github.com/Zhonghe-zhao/DailyBlog/issues/34))
[Things I like](https://github.com/Zhonghe-zhao/DailyBlog/issues/35)
![image](https://github.com/user-attachments/assets/a168bf11-661e-4566-b042-7fc9544de528)
[RSS Feed](https://raw.githubusercontent.com/{repo_name}/master/feed.xml)
"""

BACKUP_DIR = "BACKUP"
ANCHOR_NUMBER = 5

# 新的标签配置 - 方案A
TOP_ISSUES_LABELS = ["Top"]
TODO_ISSUES_LABELS = ["TODO"]
FRIENDS_LABELS = ["Friends"]
ABOUT_LABELS = ["About"]
THINGS_LABELS = ["Things"]

# 自定义分类 - 方案A平铺展示
CUSTOM_CATEGORIES = {
    "🤓 计算机基础": [
        # 操作系统
        "os", "os-linux","os-memory", "os-network",
        # 数据库
        "db", "db-sql", "db-nosql", "db-optimization", "db-design", "db-transaction",
        # 分布式系统
        "distributed-system", "distributed-consensus", "cloud-native",
        # 网络
        "network", "network-protocol",
        # 数据结构和算法
        "algorithm", "data-structure", "leetcode", "coding-interview"
    ],
    "🎭 开发技术": [
        "tech", "programming", "go", "Python", "c",
        "web-dev", "backend", 
        "tools", "ide", "productivity",
        "devops", "docker", "kubernetes", "ci-cd"
    ],
    "🧭 生活随笔": ["life", "daily-life", "thoughts", "reading", "travel", "photography"]
}

IGNORE_LABELS = (
    FRIENDS_LABELS
    + TOP_ISSUES_LABELS
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

# 原有的工具函数保持不变
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
    body = issue.body.splitlines()
    todo_undone = [l for l in body if l.startswith("- [ ] ")]
    todo_done = [l for l in body if l.startswith("- [x] ")]
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
    with open(md, "a+", encoding="utf-8") as md_file:
        md_file.write("## TODO\n")
        for issue in todo_issues:
            if is_me(issue, me):
                todo_title, todo_list = parse_TODO(issue)
                md_file.write("TODO list from " + todo_title + "\n")
                for t in todo_list:
                    md_file.write(t + "\n")
                md_file.write("\n")

def add_md_top(repo, md, me):
    top_issues = list(get_top_issues(repo))
    if not TOP_ISSUES_LABELS or not top_issues:
        return
    with open(md, "a+", encoding="utf-8") as md_file:
        md_file.write("## 🦄 置顶文章\n")
        for issue in top_issues:
            if is_me(issue, me):
                add_issue_info(issue, md_file)

def add_md_firends(repo, md, me):
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
    s = markdown.markdown(s, output_format="html", extensions=["extra"])
    with open(md, "a+", encoding="utf-8") as md_file:
        md_file.write(
            f"## [友情链接](https://github.com/{str(me)}/DailyBlog/issues/{friends_issue_number})\n"
        )
        md_file.write("<details><summary>显示</summary>\n")
        md_file.write(s)
        md_file.write("</details>\n")
        md_file.write("\n\n")

def add_md_recent(repo, md, me, limit=10):
    """显示最近更新的文章"""
    count = 0
    with open(md, "a+", encoding="utf-8") as md_file:
        md_file.write("## 📖 最近更新\n")
        try:
            for issue in repo.get_issues(sort="created", direction="desc"):
                if is_me(issue, me):
                    add_issue_info(issue, md_file)
                    count += 1
                    if count >= limit:
                        break
        except Exception as e:
            print(str(e))

def add_md_header(md, repo_name):
    with open(md, "w", encoding="utf-8") as md_file:
        md_file.write(MD_HEAD.format(repo_name=repo_name))
        md_file.write("\n")

# 替换原来的 add_md_label 函数
def add_md_custom_categories(repo, md, me):
    """使用自定义分类显示文章"""
    with open(md, "a+", encoding="utf-8") as md_file:
        for category_name, labels in CUSTOM_CATEGORIES.items():
            # 获取该分类下的所有issues
            category_issues = []
            for label_name in labels:
                try:
                    label_issues = list(repo.get_issues(labels=[label_name]))
                    for issue in label_issues:
                        if is_me(issue, me) and issue not in category_issues:
                            category_issues.append(issue)
                except Exception as e:
                    print(f"Error getting issues for label {label_name}: {e}")
                    continue
            
            # 按创建时间排序
            category_issues.sort(key=lambda x: x.created_at, reverse=True)
            
            if category_issues:
                md_file.write(f"## {category_name}\n\n")
                
                # 显示文章，超过5篇时折叠
                for i, issue in enumerate(category_issues):
                    if i == 5:  # 只显示5篇，更多内容折叠
                        md_file.write("<details><summary>显示更多</summary>\n\n")
                    
                    time = format_time(issue.created_at)
                    md_file.write(f"- [{issue.title}]({issue.html_url}) - {time}\n")
                
                if len(category_issues) > 5:
                    md_file.write("</details>\n")
                
                md_file.write("\n")

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
    
    # 获取已备份的issues
    md_files = os.listdir(dir_name) if os.path.exists(dir_name) else []
    print(f"Existing backup files: {len(md_files)}")
    
    generated_issues_numbers = []
    for filename in md_files:
        try:
            if '_' in filename and filename.split('_')[0].isdigit():
                generated_issues_numbers.append(int(filename.split('_')[0]))
        except:
            continue
    
    print(f"Already backed up issues: {generated_issues_numbers}")
    
    # 获取所有issues
    all_issues = list(repo.get_issues())
    print(f"Total issues in repo: {len(all_issues)}")
    
    # 过滤出需要生成的issues
    to_generate_issues = [
        issue for issue in all_issues 
        if issue.number not in generated_issues_numbers
    ]
    
    print(f"Issues to generate: {len(to_generate_issues)}")
    return to_generate_issues

def generate_rss_feed(repo, filename, me):
    generator = FeedGenerator()
    generator.id(repo.html_url)
    generator.title(f"RSS feed of {repo.owner.login}'s {repo.name}")
    generator.author(
        {"name": os.getenv("GITHUB_NAME"), "email": os.getenv("GITHUB_EMAIL")}
    )
    generator.link(href=repo.html_url)
    generator.link(
        href=f"https://raw.githubusercontent.com/{repo.full_name}/master/{filename}",
        rel="self",
    )
    for issue in repo.get_issues():
        if not issue.body or not is_me(issue, me) or issue.pull_request:
            continue
        item = generator.add_entry(order="append")
        item.id(issue.html_url)
        item.link(href=issue.html_url)
        item.title(issue.title)
        item.published(issue.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"))
        for label in issue.labels:
            item.category({"term": label.name})
        body = "".join(c for c in issue.body if _valid_xml_char_ordinal(c))
        item.content(CDATA(marko.convert(body)), type="html")
    generator.atom_file(filename)

def save_issue(issue, me, dir_name=BACKUP_DIR):
    """保存issue到BACKUP文件夹"""
    # 清理文件名中的非法字符
    safe_title = re.sub(r'[<>:"/\\|?*]', '-', issue.title)
    md_name = os.path.join(dir_name, f"{issue.number}_{safe_title}.md")
    
    print(f"Saving issue #{issue.number} to {md_name}")
    
    with open(md_name, "w", encoding="utf-8") as f:
        f.write(f"# [{issue.title}]({issue.html_url})\n\n")
        f.write(issue.body or "")
        if issue.comments:
            for c in issue.get_comments():
                if is_me(c, me):
                    f.write("\n\n---\n\n")
                    f.write(c.body or "")

def main(token, repo_name, issue_number=None, dir_name=BACKUP_DIR):
    """主函数"""
    print("=== Script Started ===")
    print(f"Repo: {repo_name}")
    print(f"Issue Number: {issue_number}")
    
    user = login(token)
    me = get_me(user)
    repo = get_repo(user, repo_name)
    
    print(f"Me: {me}")
    print(f"Repo full name: {repo.full_name}")
    
    # 确保BACKUP目录存在
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)
        print(f"Created backup directory: {dir_name}")
    
    # 生成README
    add_md_header("README.md", repo_name)
    
    # 按这个顺序显示 - 删除重复的调用
    for func in [
        add_md_top,                 # 置顶文章
        add_md_recent,              # 最近更新
        add_md_custom_categories,   # 自定义分类
    ]:
        func(repo, "README.md", me)

    generate_rss_feed(repo, "feed.xml", me)
    
    # 备份issues到BACKUP文件夹（只保留这一个生成逻辑）
    to_generate_issues = get_to_generate_issues(repo, dir_name, issue_number)
    
    # 保存md文件到backup文件夹
    for issue in to_generate_issues:
        print(f"Processing issue #{issue.number}: {issue.title}")
        save_issue(issue, me, dir_name)
    
    print("=== Script Completed ===")
    #调试