import os
from pathlib import Path

def print_directory_tree(directory, prefix="", exclude_dirs=None):
    """
    Print the directory tree structure while excluding specified directories.
    
    Args:
        directory (str): The root directory to start from
        prefix (str): Prefix for the current line (used for indentation)
        exclude_dirs (set): Set of directory names to exclude
    """
    if exclude_dirs is None:
        exclude_dirs = {'env', 'node_modules', '__pycache__', '.pytest_cache'}
    
    # Get the directory contents
    path = Path(directory)
    
    # Get all items in the directory, excluding those starting with '.'
    try:
        items = sorted(
            [item for item in path.iterdir() if not item.name.startswith('.')],
            key=lambda x: (x.is_file(), x.name.lower())
        )
    except PermissionError:
        return
    
    # Process each item
    for i, item in enumerate(items):
        is_last = i == len(items) - 1
        
        # Skip excluded directories
        if item.name in exclude_dirs and item.is_dir():
            continue
        
        # Create the prefix for the current item
        current_prefix = "└── " if is_last else "├── "
        
        # Print the current item
        print(f"{prefix}{current_prefix}{item.name}")
        
        # If it's a directory, recursively print its contents
        if item.is_dir():
            next_prefix = prefix + ("    " if is_last else "│   ")
            print_directory_tree(item, next_prefix, exclude_dirs)

if __name__ == "__main__":
    # Get the current working directory
    root_dir = os.getcwd()
    
    # Print the root directory name
    print(os.path.basename(root_dir))
    
    # Print the tree
    print_directory_tree(root_dir)