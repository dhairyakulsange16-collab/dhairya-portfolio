export interface Project {
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
  source?: "manual-local" | "drive";
  dateAdded?: string;
}

/**
 * Single source of truth for work section category order:
 * 1. Commercial Brand Campaigns ("Commercial Shoots") FIRST
 * 2-6. Retained relative order for intermediate production genres
 * 7. AI UGC & E-Commerce Reels ("AI UGC Videos") LAST
 */
export const CATEGORY_ORDER = [
  "Commercial Shoots",
  "Outdoor Shoots",
  "Talking Head & Reels",
  "Animations & Motion",
  "Gaming Content",
  "Podcasts & Long-Form",
  "AI UGC Videos",
] as const;

export const CATEGORIES = [
  "All",
  ...CATEGORY_ORDER,
] as const;

export type CategoryType = typeof CATEGORIES[number];

export const PROJECTS: Project[] = [
  {
    "id": "ai-ugc-videos-isha-jewellers-ugc-sample",
    "title": "isha Jewellers UGC Sample",
    "category": "AI UGC Videos",
    "folder": "AI UGC VIDEOS",
    "folderSlug": "ai-ugc-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/ai-ugc-videos/isha-jewellers-ugc-sample.mp4",
    "posterPath": "/assets/ai-ugc-videos/isha-jewellers-ugc-sample-poster.jpg",
    "duration": "0:20",
    "durationSec": 20.1,
    "resolution": "1440x2560",
    "sizeFormatted": "53.5 MB",
    "driveFileId": "1umqEnDyY2HDgOyzJRGWAXFT1A-H0qG_h",
    "driveFileName": "isha Jewellers UGC Sample .mp4",
    "tags": [
      "AI UGC Videos",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "ai-ugc-videos-isha-jewellery-bracelet-video-1-chf3-prob4",
    "title": "Isha Jewellery bracelet video 1",
    "category": "AI UGC Videos",
    "folder": "AI UGC VIDEOS",
    "folderSlug": "ai-ugc-videos",
    "aspect": "16:9",
    "orientation": "16:9 Horizontal",
    "videoPath": "/assets/ai-ugc-videos/isha-jewellery-bracelet-video-1-chf3-prob4.mp4",
    "posterPath": "/assets/ai-ugc-videos/isha-jewellery-bracelet-video-1-chf3-prob4-poster.jpg",
    "duration": "0:32",
    "durationSec": 33.0,
    "resolution": "2560x1440",
    "sizeFormatted": "272.9 MB",
    "driveFileId": "1iROPIKmkCciKB83VvXSjiXVp_DW2_Uyh",
    "driveFileName": "Isha Jewellery  bracelet video_1_chf3_prob4.mp4",
    "tags": [
      "AI UGC Videos",
      "Horizontal",
      "Drive Original"
    ]
  },
  {
    "id": "ai-ugc-videos-isha-jewellery-ai-video-11",
    "title": "ISHA JEWELLERY AI VIDEO 11",
    "category": "AI UGC Videos",
    "folder": "AI UGC VIDEOS",
    "folderSlug": "ai-ugc-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/ai-ugc-videos/isha-jewellery-ai-video-11.mp4",
    "posterPath": "/assets/ai-ugc-videos/isha-jewellery-ai-video-11-poster.jpg",
    "duration": "0:14",
    "durationSec": 14.0,
    "resolution": "1440x2560",
    "sizeFormatted": "39.4 MB",
    "driveFileId": "19G-RSshKCldJeVLWs3inAPSFvCgZ7DIu",
    "driveFileName": "ISHA JEWELLERY AI VIDEO 11.mp4",
    "tags": [
      "AI UGC Videos",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "ai-ugc-videos-isha-jewellery-ai-video-15",
    "title": "ISHA JEWELLERY AI VIDEO 15",
    "category": "AI UGC Videos",
    "folder": "AI UGC VIDEOS",
    "folderSlug": "ai-ugc-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/ai-ugc-videos/isha-jewellery-ai-video-15.mp4",
    "posterPath": "/assets/ai-ugc-videos/isha-jewellery-ai-video-15-poster.jpg",
    "duration": "0:21",
    "durationSec": 21.7,
    "resolution": "1440x2560",
    "sizeFormatted": "63.0 MB",
    "driveFileId": "1LULwZp7ZWI9Rxqfwp7wKmGk5e_kPJf3B",
    "driveFileName": "ISHA JEWELLERY AI VIDEO 15.mp4",
    "tags": [
      "AI UGC Videos",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "ai-ugc-videos-isha-jewellery-ai-video-16",
    "title": "ISHA JEWELLERY AI VIDEO 16",
    "category": "AI UGC Videos",
    "folder": "AI UGC VIDEOS",
    "folderSlug": "ai-ugc-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/ai-ugc-videos/isha-jewellery-ai-video-16.mp4",
    "posterPath": "/assets/ai-ugc-videos/isha-jewellery-ai-video-16-poster.jpg",
    "duration": "0:20",
    "durationSec": 20.1,
    "resolution": "1440x2560",
    "sizeFormatted": "55.5 MB",
    "driveFileId": "1YwPH9VOWeIGV9sYHht0BKaLqZxL4TT2p",
    "driveFileName": "ISHA JEWELLERY AI VIDEO 16.mp4",
    "tags": [
      "AI UGC Videos",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "ai-ugc-videos-isha-jewellery-exhibhtion-v4",
    "title": "Isha Jewellery Exhibhtion V4",
    "category": "AI UGC Videos",
    "folder": "AI UGC VIDEOS",
    "folderSlug": "ai-ugc-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/ai-ugc-videos/isha-jewellery-exhibhtion-v4.mp4",
    "posterPath": "/assets/ai-ugc-videos/isha-jewellery-exhibhtion-v4-poster.jpg",
    "duration": "0:16",
    "durationSec": 16.7,
    "resolution": "1440x2560",
    "sizeFormatted": "45.5 MB",
    "driveFileId": "1Ng_pQEuvnhjIDw52xR8Zzzgp7cj8iYE-",
    "driveFileName": "Isha Jewellery Exhibhtion V4.mp4",
    "tags": [
      "AI UGC Videos",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "ai-ugc-videos-isha-jewellery-ugc-video-3",
    "title": "Isha Jewellery UGC Video 3",
    "category": "AI UGC Videos",
    "folder": "AI UGC VIDEOS",
    "folderSlug": "ai-ugc-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/ai-ugc-videos/isha-jewellery-ugc-video-3.mp4",
    "posterPath": "/assets/ai-ugc-videos/isha-jewellery-ugc-video-3-poster.jpg",
    "duration": "0:25",
    "durationSec": 25.0,
    "resolution": "1440x2560",
    "sizeFormatted": "81.1 MB",
    "driveFileId": "106CWgjpuztbMLusmedp_5rxw0AVqs-k1",
    "driveFileName": "Isha Jewellery UGC Video 3.mp4",
    "tags": [
      "AI UGC Videos",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "animations-albo-app-video",
    "title": "Albo APP Video",
    "category": "Animations & Motion",
    "folder": "Animations",
    "folderSlug": "animations",
    "aspect": "16:9",
    "orientation": "16:9 Horizontal",
    "videoPath": "/assets/animations/albo-app-video.mp4",
    "posterPath": "/assets/animations/albo-app-video-poster.jpg",
    "duration": "2:26",
    "durationSec": 146.0,
    "resolution": "3840x2160",
    "sizeFormatted": "284.7 MB",
    "driveFileId": "11JkM6PGn-smzLkGh-sHGPPA2vBxA39iU",
    "driveFileName": "Albo APP Video.mp4",
    "tags": [
      "Animations & Motion",
      "Horizontal",
      "Drive Original"
    ]
  },
  {
    "id": "animations-salonsteps-smart-billing",
    "title": "SalonSteps Smart Billing",
    "category": "Animations & Motion",
    "folder": "Animations",
    "folderSlug": "animations",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/animations/salonsteps-smart-billing.mp4",
    "posterPath": "/assets/animations/salonsteps-smart-billing-poster.jpg",
    "duration": "0:16",
    "durationSec": 16.4,
    "resolution": "1440x2560",
    "sizeFormatted": "44.7 MB",
    "driveFileId": "18hrmsIugaeGMePln3s5Vthd0-R7yRlVm",
    "driveFileName": "SalonSteps Smart Billing.mp4",
    "tags": [
      "Animations & Motion",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "animations-smarter-appointment-management2",
    "title": "smarter appointment management2",
    "category": "Animations & Motion",
    "folder": "Animations",
    "folderSlug": "animations",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/animations/smarter-appointment-management2.mp4",
    "posterPath": "/assets/animations/smarter-appointment-management2-poster.jpg",
    "duration": "0:30",
    "durationSec": 30.2,
    "resolution": "1440x2560",
    "sizeFormatted": "74.0 MB",
    "driveFileId": "1zH4XFaaS64n-R6aDlz3yYqv2rNXzcFpa",
    "driveFileName": "smarter appointment management2.mp4",
    "tags": [
      "Animations & Motion",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "gaming-content-copy-of-memeso",
    "title": "Copy of memeso",
    "category": "Gaming Content",
    "folder": "Gaming Content",
    "folderSlug": "gaming-content",
    "aspect": "16:9",
    "orientation": "16:9 Horizontal",
    "videoPath": "/assets/gaming-content/copy-of-memeso.mp4",
    "posterPath": "/assets/gaming-content/copy-of-memeso-poster.jpg",
    "duration": "0:34",
    "durationSec": 34.4,
    "resolution": "1920x1080",
    "sizeFormatted": "88.1 MB",
    "driveFileId": "1rJYdLtaA3DkwQ1x10cl3Y_VNyVbfxhCG",
    "driveFileName": "Copy of memeso.mp4",
    "tags": [
      "Gaming Content",
      "Horizontal",
      "Drive Original"
    ]
  },
  {
    "id": "gaming-content-dattrax-1",
    "title": "Dattrax 1",
    "category": "Gaming Content",
    "folder": "Gaming Content",
    "folderSlug": "gaming-content",
    "aspect": "16:9",
    "orientation": "16:9 Horizontal",
    "videoPath": "/assets/gaming-content/dattrax-1.mp4",
    "posterPath": "/assets/gaming-content/dattrax-1-poster.jpg",
    "duration": "0:23",
    "durationSec": 23.9,
    "resolution": "1920x1080",
    "sizeFormatted": "60.2 MB",
    "driveFileId": "13YdD_eGOQvkRRVivDzCP4N5rIwnKFWOS",
    "driveFileName": "Dattrax 1.mp4",
    "tags": [
      "Gaming Content",
      "Horizontal",
      "Drive Original"
    ]
  },
  {
    "id": "gaming-content-find-a-needle-short",
    "title": "find a needle short",
    "category": "Gaming Content",
    "folder": "Gaming Content",
    "folderSlug": "gaming-content",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/gaming-content/find-a-needle-short.mp4",
    "posterPath": "/assets/gaming-content/find-a-needle-short-poster.jpg",
    "duration": "1:01",
    "durationSec": 61.4,
    "resolution": "1080x1920",
    "sizeFormatted": "150.5 MB",
    "driveFileId": "1UTHwxKPOsF3myjXVjgVerZ_kjyzZJ_dJ",
    "driveFileName": "find a needle short.mp4",
    "tags": [
      "Gaming Content",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "gaming-content-s1",
    "title": "s1",
    "category": "Gaming Content",
    "folder": "Gaming Content",
    "folderSlug": "gaming-content",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/gaming-content/s1.mp4",
    "posterPath": "/assets/gaming-content/s1-poster.jpg",
    "duration": "0:23",
    "durationSec": 23.5,
    "resolution": "1080x1920",
    "sizeFormatted": "56.9 MB",
    "driveFileId": "13ANlKyOO8LTvJDSrJTVWj61KAMaT0Inj",
    "driveFileName": "s1.mp4",
    "tags": [
      "Gaming Content",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-99-stores",
    "title": "99 Stores",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/outdoor-shoot/99-stores.mp4",
    "posterPath": "/assets/outdoor-shoot/99-stores-poster.jpg",
    "duration": "0:43",
    "durationSec": 43.8,
    "resolution": "1440x2560",
    "sizeFormatted": "129.2 MB",
    "driveFileId": "1JzFu4CtbQQShpH18YQFXrl1t5dqlTmdo",
    "driveFileName": "99 Stores.mp4",
    "tags": [
      "Outdoor Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-final-bgauss-motors-ev-scooter",
    "title": "Final BGauss Motors EV Scooter",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/outdoor-shoot/final-bgauss-motors-ev-scooter.mp4",
    "posterPath": "/assets/outdoor-shoot/final-bgauss-motors-ev-scooter-poster.jpg",
    "duration": "1:20",
    "durationSec": 80.4,
    "resolution": "1440x2560",
    "sizeFormatted": "201.6 MB",
    "driveFileId": "1W2sMV9eLTgyu8GIsIAJe8ZPvbg5kDNxE",
    "driveFileName": "Final BGauss Motors EV Scooter.mp4",
    "tags": [
      "Outdoor Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-gandhibuilder-3-draft",
    "title": "GandhiBuilder 3 Draft",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "16:9",
    "orientation": "16:9 Horizontal",
    "videoPath": "/assets/outdoor-shoot/gandhibuilder-3-draft.mp4",
    "posterPath": "/assets/outdoor-shoot/gandhibuilder-3-draft-poster.jpg",
    "duration": "2:40",
    "durationSec": 160.8,
    "resolution": "1920x1080",
    "sizeFormatted": "399.4 MB",
    "driveFileId": "1jAhBSd56ejfq2NYbvdDwGj72GIFXCO4r",
    "driveFileName": "GandhiBuilder 3 Draft.mp4",
    "tags": [
      "Outdoor Shoots",
      "Horizontal",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-hari-om-granite-world",
    "title": "Hari om Granite World",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/outdoor-shoot/hari-om-granite-world.mp4",
    "posterPath": "/assets/outdoor-shoot/hari-om-granite-world-poster.jpg",
    "duration": "1:03",
    "durationSec": 63.2,
    "resolution": "1440x2560",
    "sizeFormatted": "148.2 MB",
    "driveFileId": "16QkjL_Qhh9l_AvXuhsOCU5UxTmNLTes1",
    "driveFileName": "Hari om Granite World.mp4",
    "tags": [
      "Outdoor Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-hongkong-16sept3",
    "title": "HongKong 16SEPT3",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/outdoor-shoot/hongkong-16sept3.mp4",
    "posterPath": "/assets/outdoor-shoot/hongkong-16sept3-poster.jpg",
    "duration": "0:28",
    "durationSec": 28.9,
    "resolution": "1440x2560",
    "sizeFormatted": "115.4 MB",
    "driveFileId": "15AqavnSLFN6QuEQTC39KFP7YR5rh888t",
    "driveFileName": "HongKong 16SEPT3.mp4",
    "tags": [
      "Outdoor Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-hongkong-17sept",
    "title": "HongKong 17SEPT",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/outdoor-shoot/hongkong-17sept.mp4",
    "posterPath": "/assets/outdoor-shoot/hongkong-17sept-poster.jpg",
    "duration": "1:13",
    "durationSec": 73.4,
    "resolution": "1440x2560",
    "sizeFormatted": "278.3 MB",
    "driveFileId": "16A5CdTyoY4CnGdE9ljndDsakNfD-3t3f",
    "driveFileName": "HongKong 17SEPT.mp4",
    "tags": [
      "Outdoor Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-hongkong-18sept",
    "title": "HongKong 18SEPT",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/outdoor-shoot/hongkong-18sept.mp4",
    "posterPath": "/assets/outdoor-shoot/hongkong-18sept-poster.jpg",
    "duration": "1:43",
    "durationSec": 103.3,
    "resolution": "1440x2560",
    "sizeFormatted": "263.0 MB",
    "driveFileId": "1rENWw0RCz8nt_N0Odw2fj-cgKVAet6-v",
    "driveFileName": "HongKong 18SEPT.mp4",
    "tags": [
      "Outdoor Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-hongkong-18sept-2",
    "title": "HongKong 18SEPT(2)",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/outdoor-shoot/hongkong-18sept-2.mp4",
    "posterPath": "/assets/outdoor-shoot/hongkong-18sept-2-poster.jpg",
    "duration": "0:27",
    "durationSec": 27.9,
    "resolution": "1440x2560",
    "sizeFormatted": "93.8 MB",
    "driveFileId": "1dupNSn2EVLy0iKVi_BH9LZb4gRd_eXrs",
    "driveFileName": "HongKong 18SEPT(2).mp4",
    "tags": [
      "Outdoor Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-jgt-dubai-v11-1",
    "title": "JGT Dubai v11 1",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/outdoor-shoot/jgt-dubai-v11-1.mp4",
    "posterPath": "/assets/outdoor-shoot/jgt-dubai-v11-1-poster.jpg",
    "duration": "0:48",
    "durationSec": 48.2,
    "resolution": "1080x1920",
    "sizeFormatted": "122.9 MB",
    "driveFileId": "1XNWVTSlotu6FcLd2CeAnWmrmnN11cDUy",
    "driveFileName": "JGT Dubai v11_1.mp4",
    "tags": [
      "Outdoor Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-ladies-showroom-job-vacancy",
    "title": "ladies showroom Job vacancy",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/outdoor-shoot/ladies-showroom-job-vacancy.mp4",
    "posterPath": "/assets/outdoor-shoot/ladies-showroom-job-vacancy-poster.jpg",
    "duration": "0:38",
    "durationSec": 38.7,
    "resolution": "1080x1920",
    "sizeFormatted": "48.7 MB",
    "driveFileId": "1qxhpCrx-bbr7SCxA7o45tQ_DVkZRg3Go",
    "driveFileName": "ladies showroom Job vacancy.mp4",
    "tags": [
      "Outdoor Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-reackon-video",
    "title": "Reackon Video",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/outdoor-shoot/reackon-video.mp4",
    "posterPath": "/assets/outdoor-shoot/reackon-video-poster.jpg",
    "duration": "0:37",
    "durationSec": 37.7,
    "resolution": "1080x1920",
    "sizeFormatted": "55.9 MB",
    "driveFileId": "18WUPVZmufcp30ykjG9MtoueF4ZtF5wFb",
    "driveFileName": "Reackon Video.mp4",
    "tags": [
      "Outdoor Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-sai-madhav",
    "title": "Sai Madhav",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/outdoor-shoot/sai-madhav.mp4",
    "posterPath": "/assets/outdoor-shoot/sai-madhav-poster.jpg",
    "duration": "0:51",
    "durationSec": 51.6,
    "resolution": "1080x1920",
    "sizeFormatted": "65.3 MB",
    "driveFileId": "1hgwcGPiNSXNfqCKm2FrEM5UuT69a9Hfg",
    "driveFileName": "Sai Madhav.mp4",
    "tags": [
      "Outdoor Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "outdoor-shoot-tariq-riaz-testimonial",
    "title": "Tariq Riaz Testimonial",
    "category": "Outdoor Shoots",
    "folder": "Outdoor Shoot",
    "folderSlug": "outdoor-shoot",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/outdoor-shoot/tariq-riaz-testimonial.mp4",
    "posterPath": "/assets/outdoor-shoot/tariq-riaz-testimonial-poster.jpg",
    "duration": "1:01",
    "durationSec": 61.3,
    "resolution": "1440x2560",
    "sizeFormatted": "209.0 MB",
    "driveFileId": "1Q-B6zCPGx3lYUNAfD9Uvy6ahQwQi5x_I",
    "driveFileName": "Tariq Riaz Testimonial.mp4",
    "tags": [
      "Outdoor Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "commercial-shoots-ash-frames",
    "title": "Ash Frames",
    "category": "Commercial Shoots",
    "folder": "Commercial Shoots",
    "folderSlug": "commercial-shoots",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/commercial-shoots/ash-frames.mp4",
    "posterPath": "/assets/commercial-shoots/ash-frames-poster.jpg",
    "duration": "0:28",
    "durationSec": 28.2,
    "resolution": "1080x1920",
    "sizeFormatted": "14.9 MB",
    "driveFileId": "manual-local-ash-frames",
    "driveFileName": "ASH FRAMES.mp4",
    "tags": [
      "Commercial",
      "Brand",
      "Campaign",
      "Vertical"
    ],
    "source": "manual-local",
    "dateAdded": "2026-11-26"
  },
  {
    "id": "commercial-shoots-tacobell-2",
    "title": "TacoBell 2",
    "category": "Commercial Shoots",
    "folder": "Outdoor Shoot 2",
    "folderSlug": "commercial-shoots",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/commercial-shoots/tacobell-2.mp4",
    "posterPath": "/assets/commercial-shoots/tacobell-2-poster.jpg",
    "duration": "0:47",
    "durationSec": 47.7,
    "resolution": "1080x1920",
    "sizeFormatted": "121.6 MB",
    "driveFileId": "18Lltbb9r1dQ4UO1EZ1KDAIVT2kPm4Oiy",
    "driveFileName": "TacoBell_2.mp4",
    "tags": [
      "Commercial Shoots",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "talking-head-videos-26-bn-event",
    "title": "26 BN Event",
    "category": "Talking Head & Reels",
    "folder": "Talking Head Videos",
    "folderSlug": "talking-head-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/talking-head-videos/26-bn-event.mp4",
    "posterPath": "/assets/talking-head-videos/26-bn-event-poster.jpg",
    "duration": "0:59",
    "durationSec": 59.7,
    "resolution": "1080x1920",
    "sizeFormatted": "73.8 MB",
    "driveFileId": "1zHapwepzn2KEDvrJgZAsw6x4Ma7A4foa",
    "driveFileName": "26 BN Event.mp4",
    "tags": [
      "Talking Head & Reels",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "talking-head-videos-a-hobby-becomes-powerful-when-you-invest-in-learning-udemy-is-a-good-place-to-start-hobbies",
    "title": "A hobby becomes powerful when you invest in learning. @udemy is a good place to start.[hobbies,",
    "category": "Talking Head & Reels",
    "folder": "Talking Head Videos",
    "folderSlug": "talking-head-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/talking-head-videos/a-hobby-becomes-powerful-when-you-invest-in-learning-udemy-is-a-good-place-to-start-hobbies.mp4",
    "posterPath": "/assets/talking-head-videos/a-hobby-becomes-powerful-when-you-invest-in-learning-udemy-is-a-good-place-to-start-hobbies-poster.jpg",
    "duration": "0:59",
    "durationSec": 59.4,
    "resolution": "720x1280",
    "sizeFormatted": "9.7 MB",
    "driveFileId": "1cinV8UmgEnOurGG8wwl86g7atZm8UkCy",
    "driveFileName": "A hobby becomes powerful when you invest in learning. @udemy is a good place to start.[hobbies, .mp4",
    "tags": [
      "Talking Head & Reels",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "talking-head-videos-final-1-1",
    "title": "Final 1-1",
    "category": "Talking Head & Reels",
    "folder": "Talking Head Videos",
    "folderSlug": "talking-head-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/talking-head-videos/final-1-1.mp4",
    "posterPath": "/assets/talking-head-videos/final-1-1-poster.jpg",
    "duration": "1:05",
    "durationSec": 65.8,
    "resolution": "1080x1920",
    "sizeFormatted": "62.0 MB",
    "driveFileId": "1l3jeEh8ULWaBB5GssKbO9CwUvz9eEuzP",
    "driveFileName": "Final 1-1.mp4",
    "tags": [
      "Talking Head & Reels",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "talking-head-videos-final-2-1",
    "title": "Final 2-1",
    "category": "Talking Head & Reels",
    "folder": "Talking Head Videos",
    "folderSlug": "talking-head-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/talking-head-videos/final-2-1.mp4",
    "posterPath": "/assets/talking-head-videos/final-2-1-poster.jpg",
    "duration": "1:21",
    "durationSec": 81.0,
    "resolution": "1080x1920",
    "sizeFormatted": "96.5 MB",
    "driveFileId": "1kE6kcjwrF_r0dKdfs3D0nBysgmBp2CF4",
    "driveFileName": "Final 2-1.mp4",
    "tags": [
      "Talking Head & Reels",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "talking-head-videos-godrej-s-3rd-nagpur-project",
    "title": "GODREJ'S 3RD NAGPUR PROJECT",
    "category": "Talking Head & Reels",
    "folder": "Talking Head Videos",
    "folderSlug": "talking-head-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/talking-head-videos/godrej-s-3rd-nagpur-project.mp4",
    "posterPath": "/assets/talking-head-videos/godrej-s-3rd-nagpur-project-poster.jpg",
    "duration": "1:30",
    "durationSec": 90.0,
    "resolution": "1080x1920",
    "sizeFormatted": "116.7 MB",
    "driveFileId": "1-Ez27ARKgadFKBvw3WcQOrYI-HHsJkvt",
    "driveFileName": "GODREJ'S 3RD NAGPUR PROJECT.mp4",
    "tags": [
      "Talking Head & Reels",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "talking-head-videos-hongkong-reel-6-3",
    "title": "Hongkong Reel 6-3",
    "category": "Talking Head & Reels",
    "folder": "Talking Head Videos",
    "folderSlug": "talking-head-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/talking-head-videos/hongkong-reel-6-3.mp4",
    "posterPath": "/assets/talking-head-videos/hongkong-reel-6-3-poster.jpg",
    "duration": "0:36",
    "durationSec": 36.6,
    "resolution": "1080x1920",
    "sizeFormatted": "88.7 MB",
    "driveFileId": "1fhrPG26JD7dyUuzC6MMl-Cm0L-f7qDCN",
    "driveFileName": "Hongkong Reel 6-3.mp4",
    "tags": [
      "Talking Head & Reels",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "talking-head-videos-jewelsteps-v2",
    "title": "JewelSteps V2",
    "category": "Talking Head & Reels",
    "folder": "Talking Head Videos",
    "folderSlug": "talking-head-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/talking-head-videos/jewelsteps-v2.mp4",
    "posterPath": "/assets/talking-head-videos/jewelsteps-v2-poster.jpg",
    "duration": "0:34",
    "durationSec": 34.1,
    "resolution": "1440x2560",
    "sizeFormatted": "86.8 MB",
    "driveFileId": "1rYvHj1Kr3D7-7aB1YsScUwZNJqWhWMu-",
    "driveFileName": "JewelSteps V2.mp4",
    "tags": [
      "Talking Head & Reels",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "talking-head-videos-jgt-dubai-1v",
    "title": "JGT Dubai 1v",
    "category": "Talking Head & Reels",
    "folder": "Talking Head Videos",
    "folderSlug": "talking-head-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/talking-head-videos/jgt-dubai-1v.mp4",
    "posterPath": "/assets/talking-head-videos/jgt-dubai-1v-poster.jpg",
    "duration": "0:39",
    "durationSec": 39.3,
    "resolution": "1440x2560",
    "sizeFormatted": "102.3 MB",
    "driveFileId": "1hSw66RnvUzvaYGOBVjmhguJ8ccqPGYN5",
    "driveFileName": "JGT Dubai 1v.mp4",
    "tags": [
      "Talking Head & Reels",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "talking-head-videos-lispa-mam-reel",
    "title": "lispa mam reel",
    "category": "Talking Head & Reels",
    "folder": "Talking Head Videos",
    "folderSlug": "talking-head-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/talking-head-videos/lispa-mam-reel.mp4",
    "posterPath": "/assets/talking-head-videos/lispa-mam-reel-poster.jpg",
    "duration": "0:45",
    "durationSec": 45.1,
    "resolution": "1440x2560",
    "sizeFormatted": "171.8 MB",
    "driveFileId": "1jqNsrItuBMX52zPl8hxnvWAQEXGL0Rt1",
    "driveFileName": "lispa mam reel.mp4",
    "tags": [
      "Talking Head & Reels",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "talking-head-videos-one-ai-prompt-showed-me-the-exact-skill-gap-holding-me-back-i-tried-something-interesting-rece",
    "title": "One AI prompt showed me the exact skill gap holding me back \ud83d\udc23i tried something interesting rece",
    "category": "Talking Head & Reels",
    "folder": "Talking Head Videos",
    "folderSlug": "talking-head-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/talking-head-videos/one-ai-prompt-showed-me-the-exact-skill-gap-holding-me-back-i-tried-something-interesting-rece.mp4",
    "posterPath": "/assets/talking-head-videos/one-ai-prompt-showed-me-the-exact-skill-gap-holding-me-back-i-tried-something-interesting-rece-poster.jpg",
    "duration": "1:01",
    "durationSec": 61.4,
    "resolution": "720x1280",
    "sizeFormatted": "13.3 MB",
    "driveFileId": "1X86bULWnPsffy93MZM57MgjorNt0mvY8",
    "driveFileName": "One AI prompt showed me the exact skill gap holding me back \ud83d\udc23i tried something interesting rece.mp4",
    "tags": [
      "Talking Head & Reels",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "talking-head-videos-sample-31",
    "title": "Sample 31",
    "category": "Talking Head & Reels",
    "folder": "Talking Head Videos",
    "folderSlug": "talking-head-videos",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/talking-head-videos/sample-31.mp4",
    "posterPath": "/assets/talking-head-videos/sample-31-poster.jpg",
    "duration": "1:23",
    "durationSec": 83.0,
    "resolution": "1080x1920",
    "sizeFormatted": "84.8 MB",
    "driveFileId": "1_epvSA3Y2tk8B0IVZNWTSkkKwxC8U9Lb",
    "driveFileName": "Sample 31.mp4",
    "tags": [
      "Talking Head & Reels",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "podcasts-longform-leos-pros-english-acadamy-podcast-1",
    "title": "Leos Pros English Acadamy Podcast 1",
    "category": "Podcasts & Long-Form",
    "folder": "Videos 1",
    "folderSlug": "podcasts-longform",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/podcasts-longform/leos-pros-english-acadamy-podcast-1.mp4",
    "posterPath": "/assets/podcasts-longform/leos-pros-english-acadamy-podcast-1-poster.jpg",
    "duration": "1:17",
    "durationSec": 77.2,
    "resolution": "1440x2560",
    "sizeFormatted": "122.5 MB",
    "driveFileId": "17oO9Ihiny1Jr_0Mc6CE8HpM8gddQUdB-",
    "driveFileName": "Leos Pros English Acadamy Podcast 1.mp4",
    "tags": [
      "Podcasts & Long-Form",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "podcasts-longform-prestige-realtors",
    "title": "Prestige Realtors",
    "category": "Podcasts & Long-Form",
    "folder": "Videos 1",
    "folderSlug": "podcasts-longform",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/podcasts-longform/prestige-realtors.mp4",
    "posterPath": "/assets/podcasts-longform/prestige-realtors-poster.jpg",
    "duration": "0:53",
    "durationSec": 53.8,
    "resolution": "1080x1920",
    "sizeFormatted": "69.0 MB",
    "driveFileId": "17xh43eDn3ftoyU-dbSE-c2ce-f8pHNip",
    "driveFileName": "Prestige Realtors.mp4",
    "tags": [
      "Podcasts & Long-Form",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "podcasts-longform-video-553",
    "title": "Video-553",
    "category": "Podcasts & Long-Form",
    "folder": "Videos 1",
    "folderSlug": "podcasts-longform",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/podcasts-longform/video-553.mp4",
    "posterPath": "/assets/podcasts-longform/video-553-poster.jpg",
    "duration": "0:42",
    "durationSec": 42.5,
    "resolution": "720x1280",
    "sizeFormatted": "5.1 MB",
    "driveFileId": "1zK7UelQ3Utn2Qjk9qGTFrRlsdy_5xOK0",
    "driveFileName": "Video-553.mp4",
    "tags": [
      "Podcasts & Long-Form",
      "Vertical",
      "Drive Original"
    ]
  },
  {
    "id": "podcasts-longform-video-816",
    "title": "Video-816",
    "category": "Podcasts & Long-Form",
    "folder": "Videos 1",
    "folderSlug": "podcasts-longform",
    "aspect": "9:16",
    "orientation": "9:16 Vertical",
    "videoPath": "/assets/podcasts-longform/video-816.mp4",
    "posterPath": "/assets/podcasts-longform/video-816-poster.jpg",
    "duration": "0:22",
    "durationSec": 22.1,
    "resolution": "720x1280",
    "sizeFormatted": "5.3 MB",
    "driveFileId": "1Z4OGFa46B170I0EUsHlIc_v79wB4DxTb",
    "driveFileName": "Video-816.mp4",
    "tags": [
      "Podcasts & Long-Form",
      "Vertical",
      "Drive Original"
    ]
  }
];
