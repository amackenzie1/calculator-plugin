import os
import re

def remove_tailwind_classnames(folder_path):
    """
    Recursively removes inline Tailwind CSS className attributes from HTML-like tags in .tsx files
    within a specified folder and its subfolders.

    Args:
        folder_path: The path to the root folder to start the search.
    """

    # More specific regular expression to target Tailwind className attributes in HTML tags
    tailwind_regex = re.compile(r'<([a-zA-Z][a-zA-Z0-9-]*)\s+([^>]*\s*)?className="([^"]*)"([^>]*)?>')

    for root, _, files in os.walk(folder_path):  # os.walk already does recursive traversal
        for file in files:
            if file.endswith('.tsx'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Function to perform the replacement
                    def replace_classname(match):
                        tag_name = match.group(1)
                        before_classname = match.group(2) or ''
                        tailwind_classes = match.group(3)
                        after_classname = match.group(4) or ''

                        # Reconstruct the tag without the className attribute
                        return f'<{tag_name} {before_classname}{after_classname}>'

                    # Replace Tailwind className attributes
                    new_content = tailwind_regex.sub(replace_classname, content)

                    # Only write back to the file if changes were made
                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Tailwind className attributes removed from: {file_path}")

                except UnicodeDecodeError:
                    print(f"Skipping file due to encoding error: {file_path}")

# Example usage:
folder_path = '/Users/notAdmin/Dev/QUARCC/calculator-plugin/React/src/components/form-sections'  # Replace with the actual path to your root folder
remove_tailwind_classnames(folder_path)