# https://chat.deepseek.com/a/chat/s/a55bd8ef-a8b5-44ee-8364-cd2a15fb270d
import base64
import os
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


def list_files_in_folder(folder):
    """List files in a folder for context."""
    log(f"Listing files in folder: {folder}")
    files = [f for f in os.listdir(folder) if os.path.isfile(os.path.join(folder, f))]
    log(f"Found {len(files)} files.")
    return files

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


def generate_blog_with_openai(context_files, headlines=None):
    """Generate blog content using OpenAI."""
    log("Starting blog generation...")
    start_time = time.time()

    context = " ".join(context_files)

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
    Avoid these topics, as they are existing blogs:

    {context}
    {news_section}
    The md blog should include:
    - An introduction to the topic
    - Sections with headings
    - A conclusion
    - A call-to-action for readers to share their thoughts
    ENSURE THE BLOG TOPIC IS ORIGINAL
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
    
    # Remove .mdx extension from filename for canonical URL
    canonical_filename = blog.filename.replace('.mdx', '').replace('.md', '')

    formatted_blog = f"""---
title: '{blog.title}'
date: '{datetime.now().isoformat()}'
canonicalUrl: 'https://parmipicks.com/blogs/{canonical_filename}'
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
    # Step 1: List files for context
    context_files = list_files_in_folder(BLOG_FOLDER)

    # Step 2: Fetch recent headlines for topical flavour
    headlines = fetch_recent_headlines()

    # Step 3: Generate blog content
    blog_content = generate_blog_with_openai(context_files, headlines)

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
