import json
import os
from pathlib import Path
import hashlib

def generate_article_id(article):
    """Generate a unique ID for an article based on its content."""
    # Use title and content to generate a unique hash
    content_string = (article.get('title', '') + article.get('content', '')).encode('utf-8')
    return hashlib.md5(content_string).hexdigest()[:8]

def load_and_combine_jsons(directory):
    """Load all JSON files from directory and combine them into a single list."""
    all_articles = {}  # Use dict to track unique articles by their ID
    json_files = sorted(Path(directory).glob('*.json'))
    
    print(f"Found {len(json_files)} JSON files to process")
    
    for json_file in json_files:
        print(f"Processing {json_file.name}...")
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                articles = json.load(f)
                
                # Ensure we have a list of articles
                if not isinstance(articles, list):
                    print(f"Warning: {json_file.name} does not contain a list of articles")
                    continue
                
                # Process each article
                for article in articles:
                    # Generate a unique ID for the article
                    article_id = generate_article_id(article)
                    
                    # Add the ID to the article if it doesn't exist
                    if 'id' not in article:
                        article['id'] = article_id
                    
                    # Only add if we haven't seen this article before
                    if article_id not in all_articles:
                        all_articles[article_id] = article
                
        except json.JSONDecodeError:
            print(f"Error: Could not parse {json_file.name}")
        except Exception as e:
            print(f"Error processing {json_file.name}: {str(e)}")
    
    # Convert back to list and sort by date if available
    combined_articles = list(all_articles.values())
    try:
        combined_articles.sort(key=lambda x: x.get('publishedDate', ''), reverse=True)
    except Exception as e:
        print(f"Warning: Could not sort articles by date: {str(e)}")
    
    print(f"\nTotal unique articles found: {len(combined_articles)}")
    return combined_articles

def main():
    # Input and output paths
    input_dir = 'NewJsons'
    output_file = 'warroom-feed.json'
    
    # Combine all JSON files
    combined_articles = load_and_combine_jsons(input_dir)
    
    # Write the combined articles to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(combined_articles, f, indent=2, ensure_ascii=False)
    
    print(f"\nCombined articles written to {output_file}")

if __name__ == '__main__':
    main() 