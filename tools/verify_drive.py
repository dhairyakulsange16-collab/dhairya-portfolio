import os
import json
import re

workspace = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "local_mapped_drive_files.json")
with open(json_path, "r", encoding="utf-8") as f:
    drive_files = json.load(f)

projects_path = os.path.join(workspace, "src", "data", "projects.ts")
with open(projects_path, "r", encoding="utf-8") as f:
    content = f.read()

json_str = re.search(r"export const PROJECTS: Project\[\] = (\[[\s\S]*?\]);", content).group(1)
projects = json.loads(json_str)

drive_file_map = {item["fileId"]: item for item in drive_files}

drive_count = len(drive_files)
site_count = len(projects)
mismatches = 0

for p in projects:
    v_abs = os.path.join(workspace, "public", p["videoPath"].lstrip("/"))
    if not os.path.exists(v_abs) or os.path.getsize(v_abs) < 1000:
        print("Mismatch video:", p["videoPath"])
        mismatches += 1

    p_abs = os.path.join(workspace, "public", p["posterPath"].lstrip("/"))
    if not os.path.exists(p_abs) or os.path.getsize(p_abs) < 100:
        print("Mismatch poster:", p["posterPath"])
        mismatches += 1

    if p["driveFileId"] not in drive_file_map:
        print("Mismatch driveFileId:", p["title"])
        mismatches += 1

print(f"Drive files found: {drive_count}, videos in site: {site_count}, mismatches: {mismatches}")
