import os
import json
from pathlib import Path
import re


class ProjectAnalyzer:
    def __init__(self, root_dir="."):
        self.root_dir = root_dir
        self.important_files = {
            "electron": [
                "frontend/electron/main.js",
                "frontend/electron/preload.js",
                "frontend/electron/renderer.js",
            ],
            "react": [
                "frontend/react-app/src/App.js",
                "frontend/react-app/src/index.js",
                "frontend/react-app/package.json",
            ],
            "python": ["backend/app.py", "backend/requirements.txt"],
        }

    def read_file_content(self, filepath):
        try:
            with open(
                os.path.join(self.root_dir, filepath), "r", encoding="utf-8"
            ) as f:
                return f.read()
        except Exception as e:
            return f"Error reading file: {str(e)}"

    def analyze_javascript_file(self, content):
        """Basic analysis of JavaScript files"""
        analysis = {
            "imports": re.findall(r'import\s+.*\s+from\s+[\'"](.+)[\'"]', content),
            "functions": re.findall(r"function\s+(\w+)\s*\(", content),
            "arrow_functions": re.findall(
                r"const\s+(\w+)\s*=\s*\([^)]*\)\s*=>", content
            ),
            "electron_modules": re.findall(
                r'require\([\'"]([^\'"]*(electron|ipc)[^\'"]*)[\'"]\)', content
            ),
        }
        return analysis

    def analyze_python_file(self, content):
        """Basic analysis of Python files"""
        analysis = {
            "imports": re.findall(
                r"^import\s+(\w+)|^from\s+(\w+)", content, re.MULTILINE
            ),
            "functions": re.findall(r"def\s+(\w+)\s*\(", content),
            "classes": re.findall(r"class\s+(\w+)\s*[:\(]", content),
        }
        return analysis

    def analyze_project(self):
        results = {}

        for category, files in self.important_files.items():
            results[category] = {}
            for filepath in files:
                content = self.read_file_content(filepath)
                results[category][filepath] = {
                    "content": content,
                    "analysis": (
                        self.analyze_javascript_file(content)
                        if filepath.endswith(".js")
                        else (
                            self.analyze_python_file(content)
                            if filepath.endswith(".py")
                            else {"raw_content": content}
                        )
                    ),
                }

        return results

    def get_package_info(self):
        """Analyze package.json files"""
        package_files = ["package.json", "frontend/react-app/package.json"]

        package_info = {}
        for package_file in package_files:
            try:
                with open(os.path.join(self.root_dir, package_file), "r") as f:
                    package_info[package_file] = json.load(f)
            except Exception as e:
                package_info[package_file] = f"Error reading package.json: {str(e)}"

        return package_info


def main():
    analyzer = ProjectAnalyzer()
    results = analyzer.analyze_project()
    package_info = analyzer.get_package_info()

    # Save results to a JSON file for easier viewing
    output = {"project_analysis": results, "package_info": package_info}

    with open("project_analysis.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print("Analysis complete! Results saved to project_analysis.json")

    # Print summary
    print("\nProject Summary:")
    for category in results:
        print(f"\n{category.upper()} Files Analyzed:")
        for filepath in results[category]:
            print(f"- {filepath}")


if __name__ == "__main__":
    main()
