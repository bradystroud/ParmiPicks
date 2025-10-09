"""
Script to trigger Tina CMS to reindex all markdown files.
Makes a small content change (adds a space at the end) to each file.
"""
import os
from datetime import datetime


def log(message):
    """Log function to track execution progress with timestamps."""
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {message}")


def trigger_file_change(filepath):
    """Add a space at the end of the file to trigger Tina reindexing."""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Add a space at the end if not already there
        if not content.endswith(' '):
            with open(filepath, 'w') as f:
                f.write(content + ' ')
            return True
        else:
            # If it ends with a space, just rewrite it (still triggers a change)
            with open(filepath, 'w') as f:
                f.write(content)
            return True
            
    except Exception as e:
        log(f"  ✗ Error processing file: {e}")
        return False


def process_directory(directory):
    """Process all markdown files in a directory."""
    processed = 0
    
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.endswith(('.md', '.mdx')):
                filepath = os.path.join(root, filename)
                relative_path = os.path.relpath(filepath, directory)
                log(f"Processing: {relative_path}")
                
                if trigger_file_change(filepath):
                    processed += 1
                    log(f"  ✓ Triggered change")
    
    return processed


def main():
    log("Starting Tina reindex trigger script...")
    
    # Directories to process
    directories = [
        "content/blogs",
        "content/reviews",
        "content/authors",
        "content/pages",
        "content/restaurant"
    ]
    
    total_processed = 0
    
    for directory in directories:
        if os.path.exists(directory):
            log(f"\n--- Processing directory: {directory} ---")
            count = process_directory(directory)
            total_processed += count
            log(f"Processed {count} files in {directory}")
        else:
            log(f"Directory not found: {directory}")
    
    log(f"\n✓ Completed! Processed {total_processed} total files.")


if __name__ == "__main__":
    main()
