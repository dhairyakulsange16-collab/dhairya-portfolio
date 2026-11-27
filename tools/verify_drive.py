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
manual_approved = 0
mismatches = 0

with open(os.path.join(workspace, "tools", "manual-sources.json"), encoding="utf-8") as manifest:
    expected_manual = {item["id"] for item in json.load(manifest) if item.get("approved")}
actual_manual = {p["id"] for p in projects if p.get("source") == "manual-local"}
actual_drive = {p["driveFileId"] for p in projects if p.get("source") != "manual-local"}
mismatches += len(actual_manual ^ expected_manual) + len(actual_drive ^ set(drive_file_map))
mismatches += len(projects) - len({p["id"] for p in projects})
for directory, _, filenames in os.walk(os.path.join(workspace, "public", "assets")):
    for name in filenames:
        if os.path.getsize(os.path.join(directory, name)) > 50_000_000:
            print("Oversized asset:", name)
            mismatches += 1

for p in projects:
    v_abs = os.path.join(workspace, "public", p["videoPath"].lstrip("/"))
    if not os.path.exists(v_abs) or os.path.getsize(v_abs) < 1000:
        print("Mismatch video:", p["videoPath"])
        mismatches += 1

    p_abs = os.path.join(workspace, "public", p["posterPath"].lstrip("/"))
    if not os.path.exists(p_abs) or os.path.getsize(p_abs) < 100:
        print("Mismatch poster:", p["posterPath"])
        mismatches += 1

    # Check source: manual-local is approved exception
    if p.get("source") == "manual-local":
        manual_approved += int(p["id"] in expected_manual)
    else:
        if p["driveFileId"] not in drive_file_map:
            print("Mismatch driveFileId:", p["title"])
            mismatches += 1

print(f"Drive files found: {drive_count}, videos in site: {site_count}, manual approved: {manual_approved}, mismatches: {mismatches}")

raise SystemExit(1 if mismatches else 0)
