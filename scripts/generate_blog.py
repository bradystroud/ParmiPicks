# https://chat.deepseek.com/a/chat/s/a55bd8ef-a8b5-44ee-8364-cd2a15fb270d
import os
import time
import requests
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

def generate_blog_with_openai(context_files):
    """Generate blog content using OpenAI."""
    log("Starting blog generation...")
    start_time = time.time()

    context = " ".join(context_files)
    prompt = f"""
    Write a unique and engaging blog post about chicken parmigiana. 
    Avoid these topics, as they are existing blogs: 
    
    {context}

    The md blog should include:
    - An introduction to the topic
    - Sections with headings
    - A conclusion
    - A call-to-action for readers to share their thoughts
    ENSURE THE BLOG TOPIC IS ORIGINAL
    Don't include a title in the body of the content.
    """

    client = OpenAI()

    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a professional blog writer. You write unique, creative and engaging blog posts about chicken parmis for parmipicks.com.",
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
    """Generate an image using OpenAI DALL·E."""
    log("Starting image generation...")
    start_time = time.time()

    client = OpenAI()

    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1792x1024",
            quality="standard",
            n=1,
        )
    except openai.OpenAIError as e:
        print(e.http_status)
        print(e.error)

    log(f"Image generated in {time.time() - start_time:.2f} seconds.")

    return response.data[0].url


def save_blog_and_image(blog, image_url):
    """Save the blog post and image locally."""
    log("Saving blog and image...")
    start_time = time.time()

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    blog_filename = f"{BLOG_FOLDER}/{ensure_single_extension(blog.filename)}"
    image_filename = f"{IMAGE_FOLDER}/{timestamp}.jpg"

    formatted_blog = f"""---
title: '{blog.title}'
date: '{datetime.now().isoformat()}'
canonicalUrl: 'https://parmipicks.com/blogs/{blog.filename}'
heroImage: '/uploads/blog-images/{timestamp}.jpg'
author: 'content/authors/brady.md'
---

{blog.content}
"""

    # Save blog content
    with open(blog_filename, "w") as f:
        f.write(formatted_blog)
    log(f"Blog saved to {blog_filename}")

    # Download and save image
    if image_url:
        image_response = requests.get(image_url)
        with open(image_filename, "wb") as f:
            f.write(image_response.content)
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

    # Step 2: Generate blog content
    blog_content = generate_blog_with_openai(context_files)

    # Step 3: Generate image
    image_prompt = f"I am writing a blog about {blog_content.title} and I need an image to go with it. The image should be related to the topic and visually appealing."
    image_url = generate_image_with_openai(image_prompt)

    # Step 4: Save blog and image
    save_blog_and_image(blog_content, image_url)

    log("Script execution completed.")
    log(f"Script executed in {time.time() - start_time:.2f} seconds.")


if __name__ == "__main__":
    main()
