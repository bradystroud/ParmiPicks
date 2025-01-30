# https://chat.deepseek.com/a/chat/s/a55bd8ef-a8b5-44ee-8364-cd2a15fb270d
import os
import openai
from datetime import datetime
import requests

# Set API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Folder paths
BLOG_FOLDER = "content/blogs"
IMAGE_FOLDER = "public/blog-images"

# Ensure folders exist
os.makedirs(BLOG_FOLDER, exist_ok=True)
os.makedirs(IMAGE_FOLDER, exist_ok=True)

# Step 1: List files in a folder for context
def list_files_in_folder(folder):
    return [f for f in os.listdir(folder) if os.path.isfile(os.path.join(folder, f))]

# Step 2: Generate blog content using OpenAI GPT
def generate_blog_with_openai(context_files):
    context = " ".join(context_files)  # Use file names as context
    prompt = f"""
    Write a unique and engaging blog post about chicken parmigiana. 
    Use this context: {context}
    The blog should include:
    - A catchy title
    - An introduction to the topic
    - Sections with headings
    - A conclusion
    - A call-to-action for readers to share their thoughts
    """
    response = openai.ChatCompletion.create(
        model="gpt-4",  # or "gpt-3.5-turbo"
        messages=[
            {"role": "system", "content": "You are a helpful assistant that writes blog posts about chicken parmigiana."},
            {"role": "user", "content": prompt},
        ],
    )
    return response["choices"][0]["message"]["content"]

# Step 3: Generate an image using OpenAI DALL·E
def generate_image_with_openai(prompt):
    response = openai.Image.create(
        prompt=prompt,
        n=1,
        size="1024x1024",
    )
    return response["data"][0]["url"]

# Step 4: Save blog and image, then create a PR
def save_blog_and_image(blog_content, image_url):
    # Generate unique filenames
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    blog_filename = f"{BLOG_FOLDER}/{timestamp}.md"
    image_filename = f"{IMAGE_FOLDER}/{timestamp}.jpg"

    # Format blog content with front matter
    title = "New Chicken Parmi Blog"  # Extract title from blog content if needed
    formatted_blog = f"""---
title: {title}
date: '{datetime.now().isoformat()}'
cannonicalUrl: 'https://parmipicks.com/blogs/{title.lower().replace(" ", "-")}'
heroImage: '/blog-images/{timestamp}.jpg'
author: 'content/authors/brady.md'
---

{blog_content}
"""

    # Save blog content
    with open(blog_filename, "w") as f:
        f.write(formatted_blog)

    # Download and save image
    image_response = requests.get(image_url)
    with open(image_filename, "wb") as f:
        f.write(image_response.content)

    print(f"Blog saved to {blog_filename}")
    print(f"Image saved to {image_filename}")

# Main function
def main():
    # Step 1: List files for context
    context_files = list_files_in_folder(BLOG_FOLDER)

    # Step 2: Generate blog content
    blog_content = generate_blog_with_openai(context_files)

    # Step 3: Generate image
    image_prompt = "A delicious chicken parmigiana served in a cozy pub setting, with a golden crust and melted cheese."
    image_url = generate_image_with_openai(image_prompt)

    # Step 4: Save blog and image
    save_blog_and_image(blog_content, image_url)

if __name__ == "__main__":
    main()