"""
Script to fix canonical URLs in existing blog posts.
Removes .mdx and .md extensions from canonicalUrl frontmatter.
"""
import os
import re
from datetime import datetime


def log(message):
    """Log function to track execution progress with timestamps."""
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}")


def fix_canonical_url_in_file(filepath):
    """Fix the canonical URL in a single blog file."""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Pattern to match canonicalUrl with .mdx or .md extension
    pattern = r"(canonicalUrl:\s*['\"]https://parmipicks\.com/blogs/)([^'\"]+?)(\.mdx|\.md)(['\"])"
    
    # Check if the file has the issue
    if re.search(pattern, content):
        # Replace the pattern, removing the extension
        updated_content = re.sub(pattern, r'\1\2\4', content)
        
        # Write back to file
        with open(filepath, 'w') as f:
            f.write(updated_content)
        
        return True
    
    return False


def main():
    log("Starting canonical URL fix script...")
    
    blog_folder = "content/blogs"
    
    if not os.path.exists(blog_folder):
        log(f"Error: Blog folder '{blog_folder}' not found!")
        return
    
    files = [f for f in os.listdir(blog_folder) if f.endswith(('.md', '.mdx'))]
    log(f"Found {len(files)} blog files to process.")
    
    fixed_count = 0
    
    for filename in files:
        filepath = os.path.join(blog_folder, filename)
        log(f"Processing: {filename}")
        
        if fix_canonical_url_in_file(filepath):
            fixed_count += 1
            log(f"  ✓ Fixed canonical URL in {filename}")
        else:
            log(f"  - No fix needed for {filename}")
    
    log(f"\nCompleted! Fixed {fixed_count} out of {len(files)} files.")


if __name__ == "__main__":
    main()
