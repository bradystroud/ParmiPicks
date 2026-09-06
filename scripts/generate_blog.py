import base64
import json
import os
import re
import time
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
from dotenv import load_dotenv
import openai
from openai import OpenAI
from pydantic import BaseModel

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Folder paths
BLOG_FOLDER = "content/blogs"
IMAGE_FOLDER = "public/uploads/blog-images"

# Generator PRs are titled with this prefix (see .github/workflows/generate-blog-cron.yml).
# It lets us recognise posts that are proposed but not yet merged, so they can be
# excluded as topics even though they are not in BLOG_FOLDER on main.
PR_TITLE_PREFIX = "New blog post: "

# How many times to ask for a fresh topic before giving up and failing the run.
MAX_ATTEMPTS = 3

# Ensure folders exist
os.makedirs(BLOG_FOLDER, exist_ok=True)
os.makedirs(IMAGE_FOLDER, exist_ok=True)


def log(message):
    """Log function to track execution progress with timestamps."""
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}")


class Blog(BaseModel):
    filename: str
    title: str
    content: str


class OriginalityVerdict(BaseModel):
    is_duplicate: bool
    overlapping_title: str
    reason: str


def read_frontmatter_title(path):
    """Return the title from a post's YAML frontmatter, or None if not found."""
    try:
        with open(path, encoding="utf-8") as f:
            text = f.read(4000)
    except OSError:
        return None
    match = re.search(r"^title:\s*(.+)$", text, re.MULTILINE)
    if not match:
        return None
    title = match.group(1).strip()
    if len(title) >= 2 and title[0] == title[-1] and title[0] in "'\"":
        title = title[1:-1]
    return title


def list_existing_post_titles(folder):
    """List the titles of published posts. Falls back to the filename when a post has no title."""
    log(f"Reading post titles from folder: {folder}")
    titles = []
    for name in sorted(os.listdir(folder)):
        path = os.path.join(folder, name)
        if not os.path.isfile(path):
            continue
        title = read_frontmatter_title(path) or os.path.splitext(name)[0]
        titles.append(title)
    log(f"Found {len(titles)} published posts.")
    return titles


def fetch_open_pr_titles():
    """List titles of unmerged posts proposed by earlier runs. Best-effort: returns [] on failure."""
    token = os.getenv("GITHUB_TOKEN")
    repo = os.getenv("GITHUB_REPOSITORY")
    if not token or not repo:
        log("GITHUB_TOKEN or GITHUB_REPOSITORY not set; skipping open PR lookup.")
        return []
    url = f"https://api.github.com/repos/{repo}/pulls?state=open&per_page=100"
    try:
        request = urllib.request.Request(
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github+json",
                "User-Agent": "parmipicks-blog-bot",
            },
        )
        with urllib.request.urlopen(request, timeout=10) as response:
            pulls = json.loads(response.read())
    except Exception as e:
        log(f"Could not fetch open PRs: {e}")
        return []
    titles = [
        pr["title"][len(PR_TITLE_PREFIX):].strip()
        for pr in pulls
        if pr.get("title", "").startswith(PR_TITLE_PREFIX)
    ]
    log(f"Found {len(titles)} open blog PRs.")
    return titles


NEWS_FEEDS = [
    "https://www.abc.net.au/news/feed/51120/rss.xml",  # ABC News Australia - Just In
    "https://feeds.bbci.co.uk/sport/rss.xml",  # BBC Sport - big events like the World Cup
]


def fetch_recent_headlines(limit_per_feed=5):
    """Fetch recent news headlines to give the blog topical flavour. Best-effort: returns [] on failure."""
    headlines = []
    for feed in NEWS_FEEDS:
        try:
            request = urllib.request.Request(feed, headers={"User-Agent": "parmipicks-blog-bot"})
            with urllib.request.urlopen(request, timeout=10) as response:
                root = ET.fromstring(response.read())
            titles = [item.findtext("title") for item in root.iter("item")]
            headlines.extend(title for title in titles[:limit_per_feed] if title)
        except Exception as e:
            log(f"Could not fetch news from {feed}: {e}")
    log(f"Fetched {len(headlines)} news headlines.")
    return headlines


def generate_blog_with_openai(existing_titles, headlines=None):
    """Generate blog content using OpenAI."""
    log("Starting blog generation...")
    start_time = time.time()

    existing_list = "\n".join(f"- {title}" for title in existing_titles)

    news_section = ""
    if headlines:
        headline_list = "\n".join(f"- {headline}" for headline in headlines)
        news_section = f"""
    For inspiration, here are some current news headlines:

    {headline_list}

    If one of these (e.g. a major sporting event or cultural moment) can be tied to chicken
    parmigiana in a fun, natural way, weave it into the blog post. If none fit, ignore them
    entirely - never force a connection.
    """

    prompt = f"""
    Write a unique and engaging blog post about chicken parmigiana.

    These posts already exist. Do NOT write about any of these topics, and do not write a
    variation, sequel or rewording of any of them:

    {existing_list}
    {news_section}
    The md blog should include:
    - An introduction to the topic
    - Sections with headings
    - A conclusion
    - A call-to-action for readers to share their thoughts
    ENSURE THE BLOG TOPIC IS ORIGINAL. Pick an angle that none of the existing titles cover.
    Do not open with "There are two kinds of..." - that opening has been used already.
    Don't include a title in the body of the content.
    """

    client = OpenAI()

    response = client.chat.completions.parse(
        model="gpt-5.5",
        messages=[
            {
                "role": "system",
                "content": "You are a professional blog writer. You write unique, creative and engaging blog posts about chicken parmis for parmipicks.com. Chicken parmigiana is a popular dish, mostly in Australia that consists of breaded chicken breast topped with marinara sauce, ham and melted cheese. Your task is to create a blog post that is informative, entertaining, and encourages readers to share their thoughts in the comments section. It also need to be unique and not cover topics that have already been written about.",
            },
            {"role": "user", "content": prompt},
        ],
        response_format=Blog,
    )

    structured_output = response.choices[0].message.parsed
    log(structured_output.title)
    log(structured_output.filename)
    log(f"Blog generated in {time.time() - start_time:.2f} seconds.")

    return structured_output


def check_originality(blog, existing_titles):
    """Ask the model whether the new post covers the same ground as an existing title."""
    log("Checking topic originality...")
    existing_list = "\n".join(f"- {title}" for title in existing_titles)
    excerpt = blog.content[:1500]

    prompt = f"""
    A blog about chicken parmigiana already has these posts:

    {existing_list}

    A new post has been drafted:

    Title: {blog.title}
    Opening excerpt:
    {excerpt}

    Does the new post cover substantially the same topic as any existing post? Treat a
    different title on the same subject (for example two posts about reheating leftovers,
    or two posts about the perfect chip-to-parmi ratio) as a duplicate. A shared passing
    mention is not a duplicate; the core subject must overlap.

    If it is a duplicate, set overlapping_title to the existing title it overlaps.
    If it is original, set is_duplicate to false and overlapping_title to an empty string.
    """

    client = OpenAI()
    response = client.chat.completions.parse(
        model="gpt-5.5",
        messages=[
            {"role": "system", "content": "You are a strict editor who prevents duplicate content on a blog."},
            {"role": "user", "content": prompt},
        ],
        response_format=OriginalityVerdict,
    )
    verdict = response.choices[0].message.parsed
    if verdict.is_duplicate:
        log(f"Duplicate of '{verdict.overlapping_title}': {verdict.reason}")
    else:
        log("Topic is original.")
    return verdict


def generate_original_blog(existing_titles, headlines):
    """Generate a post, rejecting drafts that duplicate an existing or pending post."""
    avoid = list(existing_titles)
    for attempt in range(1, MAX_ATTEMPTS + 1):
        log(f"Generation attempt {attempt} of {MAX_ATTEMPTS}")
        blog = generate_blog_with_openai(avoid, headlines)

        target = os.path.join(BLOG_FOLDER, ensure_single_extension(blog.filename))
        if os.path.exists(target):
            log(f"Rejected: {target} already exists.")
            avoid.append(blog.title)
            continue

        verdict = check_originality(blog, existing_titles)
        if verdict.is_duplicate:
            avoid.append(blog.title)
            continue

        return blog

    raise SystemExit(f"Could not produce an original topic after {MAX_ATTEMPTS} attempts.")


def generate_image_with_openai(prompt):
    """Generate an image using OpenAI GPT Image."""
    log("Starting image generation...")
    start_time = time.time()

    client = OpenAI()

    try:
        response = client.images.generate(
            model="gpt-image-2",
            prompt=prompt,
            size="1536x1024",
            quality="high",
            n=1,
        )
    except openai.OpenAIError as e:
        log(f"Image generation failed: {e}")
        return None

    log(f"Image generated in {time.time() - start_time:.2f} seconds.")

    # GPT Image models return base64-encoded images, not URLs
    return base64.b64decode(response.data[0].b64_json)


def save_blog_and_image(blog, image_bytes):
    """Save the blog post and image locally."""
    log("Saving blog and image...")
    start_time = time.time()

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    blog_filename = f"{BLOG_FOLDER}/{ensure_single_extension(blog.filename)}"
    image_filename = f"{IMAGE_FOLDER}/{timestamp}.jpg"

    # json.dumps gives a double-quoted string with any inner quotes escaped, which is valid YAML.
    formatted_blog = f"""---
title: {json.dumps(blog.title, ensure_ascii=False)}
date: '{datetime.now().isoformat()}'
heroImage: '/uploads/blog-images/{timestamp}.jpg'
author: 'content/authors/brady.md'
---

{blog.content}
"""

    # Save blog content
    with open(blog_filename, "w") as f:
        f.write(formatted_blog)
    log(f"Blog saved to {blog_filename}")

    # Save image
    if image_bytes:
        with open(image_filename, "wb") as f:
            f.write(image_bytes)
        log(f"Image saved to {image_filename}")

    log(f"Save operation completed in {time.time() - start_time:.2f} seconds.")


def ensure_single_extension(filename):
    base, ext = os.path.splitext(filename)

    # If the extension is already correct, return as is
    if ext == ".mdx" and not base.endswith(".mdx"):
        return filename

    # Remove any duplicate extensions and ensure a single .mdx extension
    base = base.rstrip(".md").rstrip(".mdx")
    corrected_filename = base + ".mdx"

    return corrected_filename


def main():
    log("Starting script...")
    start_time = time.time()
    # Step 1: Collect every topic already taken: published posts plus posts awaiting review
    existing_titles = list_existing_post_titles(BLOG_FOLDER) + fetch_open_pr_titles()

    # Step 2: Fetch recent headlines for topical flavour
    headlines = fetch_recent_headlines()

    # Step 3: Generate blog content, retrying if the topic is a duplicate
    blog_content = generate_original_blog(existing_titles, headlines)

    # Step 4: Generate image
    image_prompt = f"I am writing a blog about {blog_content.title} and I need an image to go with it. The image should be related to the topic and visually appealing."
    image_bytes = generate_image_with_openai(image_prompt)

    # Step 5: Save blog and image
    save_blog_and_image(blog_content, image_bytes)

    # Expose the title to later workflow steps (e.g. the PR title)
    github_env = os.getenv("GITHUB_ENV")
    if github_env:
        with open(github_env, "a") as f:
            f.write(f"BLOG_TITLE<<BLOG_TITLE_EOF\n{blog_content.title}\nBLOG_TITLE_EOF\n")

    log("Script execution completed.")
    log(f"Script executed in {time.time() - start_time:.2f} seconds.")


if __name__ == "__main__":
    main()
