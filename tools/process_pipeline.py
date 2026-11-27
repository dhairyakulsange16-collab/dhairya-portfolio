import os
import re
import json
import subprocess
from pathlib import Path
from tempfile import TemporaryDirectory
from datetime import date


tools_dir = Path(__file__).resolve().parent
workspace = tools_dir.parent
json_path = tools_dir / "local_mapped_drive_files.json"
catalog_path = workspace / "src/data/projects.ts"
catalog = catalog_path.read_text(encoding="utf-8")
entries = re.search(r"export const PROJECTS: Project\[\] = (\[[\s\S]*?\]);", catalog)
projects = json.loads(entries[1])
known_ids = {p["driveFileId"] for p in projects}

public_assets = os.path.join(workspace, "public", "assets")

with open(json_path, "r", encoding="utf-8") as f:
    drive_files = json.load(f)

def slugify(text):
    text = text.lower()
    text = re.sub(r'\.mp4$', '', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def clean_title(filename):
    title = re.sub(r'\.mp4$', '', filename, flags=re.IGNORECASE)
    title = re.sub(r'_prob\d+.*$', '', title)
    title = re.sub(r'_chf\d+.*$', '', title)
    title = re.sub(r'\[.*?\]', '', title)
    title = title.replace('_', ' ')
    title = re.sub(r'\s+', ' ', title).strip()
    return title

folder_category_map = {
    "AI UGC VIDEOS": "AI UGC Videos",
    "Animations": "Animations & Motion",
    "Gaming Content": "Gaming Content",
    "Outdoor Shoot": "Outdoor Shoots",
    "Outdoor Shoot 2": "Commercial Shoots",
    "Talking Head Videos": "Talking Head & Reels",
    "Videos 1": "Podcasts & Long-Form"
}

folder_slug_map = {
    "AI UGC VIDEOS": "ai-ugc-videos",
    "Animations": "animations",
    "Gaming Content": "gaming-content",
    "Outdoor Shoot": "outdoor-shoot",
    "Outdoor Shoot 2": "commercial-shoots",
    "Talking Head Videos": "talking-head-videos",
    "Videos 1": "podcasts-longform"
}

# Ensure directories exist
for fslug in folder_slug_map.values():
    os.makedirs(os.path.join(public_assets, fslug), exist_ok=True)

# First step: probe metadata for all files
metadata_list = []

for item in drive_files:
    if item["fileId"] in known_ids:
        continue
    fname = item["fileName"]
    folder = item["folder"]
    folder_slug = folder_slug_map[folder]
    category = folder_category_map[folder]
    src_path = item["localPath"]
    
    stat = os.stat(src_path)
    size_mb = stat.st_size / (1024 * 1024)
    size_formatted = f"{size_mb:.1f} MB"
    
    width = None
    height = None
    duration_sec = 0.0
    
    try:
        cmd = [
            "ffprobe", "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=width,height,duration",
            "-show_entries", "format=duration",
            "-of", "json",
            src_path
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
        probe = json.loads(res.stdout)
        stream = (probe.get("streams") or [{}])[0]
        fmt = probe.get("format") or {}
        duration_sec = float(stream.get("duration") or fmt.get("duration") or 0.0)
        width = stream.get("width")
        height = stream.get("height")
    except Exception as e:
        raise RuntimeError(f"Could not probe {fname}") from e
        
    mins = int(duration_sec // 60)
    secs = int(duration_sec % 60)
    duration_formatted = f"{mins}:{secs:02d}"
    
    if width and height:
        orientation = "9:16 Vertical" if width < height else "16:9 Horizontal"
        res_str = f"{width}x{height}"
    else:
        raise ValueError(f"Missing video dimensions for {fname}")
        
    title = clean_title(fname)
    slug = slugify(fname)
    
    metadata_list.append({
        "item": item,
        "fileName": fname,
        "folder": folder,
        "folderSlug": folder_slug,
        "category": category,
        "srcPath": src_path,
        "sizeFormatted": size_formatted,
        "sizeBytes": stat.st_size,
        "durationSec": round(duration_sec, 1),
        "durationFormatted": duration_formatted,
        "width": width,
        "height": height,
        "resolution": res_str,
        "orientation": orientation,
        "aspect": "9:16" if "Vertical" in orientation else "16:9",
        "title": title,
        "slug": slug
    })

def process_single_video(m):
    fslug = m["folderSlug"]
    slug = m["slug"]
    src = m["srcPath"]
    
    dest_video_name = f"{slug}.mp4"
    dest_poster_name = f"{slug}-poster.jpg"
    dest_video_path = os.path.join(public_assets, fslug, dest_video_name)
    dest_poster_path = os.path.join(public_assets, fslug, dest_poster_name)
    
    public_video_url = f"/assets/{fslug}/{dest_video_name}"
    public_poster_url = f"/assets/{fslug}/{dest_poster_name}"
    
    if any(project["id"] == f"{fslug}-{slug}" for project in projects):
        raise ValueError(f"Duplicate project slug: {slug}")
    if Path(dest_video_path).exists() or Path(dest_poster_path).exists():
        raise FileExistsError(f"Asset destination already exists: {slug}")

    scale = "scale=-2:960" if m["aspect"] == "9:16" else "scale=1280:-2"
    with TemporaryDirectory(dir=Path(dest_video_path).parent) as staging:
        video = Path(staging) / dest_video_name
        poster = Path(staging) / dest_poster_name
        subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vf", scale,
                        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "23",
                        "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(video)], check=True)
        if video.stat().st_size > 50_000_000:
            raise ValueError(f"{slug} exceeds 50 MB. Use a lower bitrate before importing.")
        subprocess.run(["ffmpeg", "-v", "error", "-ss", str(min(1, m["durationSec"] / 2)),
                        "-i", str(video), "-frames:v", "1", str(poster)], check=True)
        if not poster.is_file() or not poster.stat().st_size:
            raise ValueError(f"No poster frame available for {slug}")
        video.replace(dest_video_path)
        poster.replace(dest_poster_path)

    return {
        "id": f"{fslug}-{slug}",
        "title": m["title"],
        "category": m["category"],
        "folder": m["folder"],
        "folderSlug": fslug,
        "aspect": m["aspect"],
        "orientation": m["orientation"],
        "videoPath": public_video_url,
        "posterPath": public_poster_url,
        "duration": m["durationFormatted"],
        "durationSec": m["durationSec"],
        "resolution": m["resolution"],
        "sizeFormatted": m["sizeFormatted"],
        "driveFileId": m["item"]["fileId"],
        "driveFileName": m["fileName"],
        "dateAdded": date.today().isoformat(),
        "source": "drive",
        "tags": [m["category"], "Vertical" if m["aspect"] == "9:16" else "Horizontal", "Drive Original"]
    }

for metadata in metadata_list:
    project = process_single_video(metadata)
    projects.append(project)
    array = json.dumps(projects, indent=2, ensure_ascii=False)
    updated = catalog[:entries.start(1)] + array + catalog[entries.end(1):]
    with TemporaryDirectory(dir=catalog_path.parent) as staging:
        staged_catalog = Path(staging) / "projects.ts"
        staged_catalog.write_text(updated, encoding="utf-8")
        staged_catalog.replace(catalog_path)

print(f"Imported {len(metadata_list)} new Drive projects.")
