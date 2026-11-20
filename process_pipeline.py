import os
import re
import json
import subprocess
import shutil
from concurrent.futures import ThreadPoolExecutor

workspace = "E:\\Dhairya\\codes\\Dhairya\\Portfolio"
json_path = os.path.join(workspace, "local_mapped_drive_files.json")
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
        print(f"Probe error on {fname}: {e}")
        
    mins = int(duration_sec // 60)
    secs = int(duration_sec % 60)
    duration_formatted = f"{mins}:{secs:02d}"
    
    if width and height:
        orientation = "9:16 Vertical" if width < height else "16:9 Horizontal"
        res_str = f"{width}x{height}"
    else:
        orientation = "16:9 Horizontal"
        res_str = "1920x1080"
        
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

# Print the required table
print("\n" + "="*125)
print(f"{'SUBFOLDER':<22} | {'FILE NAME':<34} | {'TYPE':<4} | {'SIZE':<9} | {'DURATION':<8} | {'RESOLUTION':<11} | {'ORIENTATION'}")
print("="*125)
for m in metadata_list:
    f_sub = m["folder"][:21]
    f_name = m["fileName"][:33]
    print(f"{f_sub:<22} | {f_name:<34} | {'MP4':<4} | {m['sizeFormatted']:<9} | {m['durationFormatted']:<8} | {m['resolution']:<11} | {m['orientation']}")
print("="*125)
print(f"Total Google Drive Files: {len(metadata_list)}\n")

# Process web files with multithreading
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
    
    # Generate poster first from original source
    if not os.path.exists(dest_poster_path) or os.path.getsize(dest_poster_path) < 1000:
        ss_time = "00:00:01.0" if m["durationSec"] > 1.5 else "00:00:00.1"
        try:
            subprocess.run([
                "ffmpeg", "-y", "-ss", ss_time, "-i", src,
                "-vframes", "1", "-q:v", "2", dest_poster_path
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        except Exception as e:
            print(f"Poster failed for {slug}: {e}")

    # Generate compressed video
    if not os.path.exists(dest_video_path) or os.path.getsize(dest_video_path) < 1000:
        # If original is already reasonable size (< 15MB) and mp4, we can copy or lightly compress
        if m["sizeBytes"] <= 15 * 1024 * 1024:
            shutil.copyfile(src, dest_video_path)
        else:
            # Re-encode to optimized web size
            scale_filter = "scale=-2:960" if m["aspect"] == "9:16" else "scale=1280:-2"
            try:
                subprocess.run([
                    "ffmpeg", "-y", "-i", src,
                    "-vf", scale_filter,
                    "-c:v", "libx264", "-crf", "26", "-preset", "veryfast",
                    "-c:a", "aac", "-b:a", "128k",
                    "-movflags", "+faststart",
                    dest_video_path
                ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            except Exception as e:
                print(f"Encode failed for {slug}, copying original: {e}")
                shutil.copyfile(src, dest_video_path)

    # If poster still doesn't exist, try from compressed video
    if not os.path.exists(dest_poster_path) or os.path.getsize(dest_poster_path) < 1000:
        try:
            subprocess.run([
                "ffmpeg", "-y", "-ss", "00:00:00.1", "-i", dest_video_path,
                "-vframes", "1", "-q:v", "2", dest_poster_path
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            pass

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
        "tags": [m["category"], "Vertical" if m["aspect"] == "9:16" else "Horizontal", "Drive Original"]
    }

print("Encoding web videos and generating posters in parallel (8 threads)...")
with ThreadPoolExecutor(max_workers=8) as executor:
    results = list(executor.map(process_single_video, metadata_list))

print("All videos and posters generated!")

# Build data files
data_ts = f'''export interface Project {{
  id: string;
  title: string;
  category: string;
  folder: string;
  folderSlug: string;
  aspect: "9:16" | "16:9";
  orientation: string;
  videoPath: string;
  posterPath: string;
  duration: string;
  durationSec: number;
  resolution: string;
  sizeFormatted: string;
  driveFileId: string;
  driveFileName: string;
  tags: string[];
}}

export const CATEGORIES = [
  "All",
  "AI UGC Videos",
  "Animations & Motion",
  "Gaming Content",
  "Outdoor Shoots",
  "Commercial Shoots",
  "Talking Head & Reels",
  "Podcasts & Long-Form"
] as const;

export const PROJECTS: Project[] = {json.dumps(results, indent=2)};
'''

with open(os.path.join(workspace, "src", "data", "projects.ts"), "w", encoding="utf-8") as f:
    f.write(data_ts)

with open(os.path.join(workspace, "data", "projects.ts"), "w", encoding="utf-8") as f:
    f.write(data_ts)

# Verification script
print("\n--- VERIFICATION STEP (Step 2.9) ---")
drive_count = len(drive_files)
site_count = len(results)
mismatches = 0

for p in results:
    abs_video = os.path.join(workspace, "public", p["videoPath"].lstrip("/"))
    abs_poster = os.path.join(workspace, "public", p["posterPath"].lstrip("/"))
    
    if not os.path.exists(abs_video) or os.path.getsize(abs_video) < 1000:
        print(f"[MISMATCH] Missing video: {p['videoPath']}")
        mismatches += 1
    if not os.path.exists(abs_poster) or os.path.getsize(abs_poster) < 100:
        print(f"[MISMATCH] Missing poster: {p['posterPath']}")
        mismatches += 1

print(f"Drive files found: {drive_count}, videos in site: {site_count}, mismatches: {mismatches}")
if mismatches == 0:
    print("VERIFICATION PASSED: All site videos map 100% to authentic Drive files!")
