export interface SocialLink {
  id: string;
  name: string;
  handle: string;
  url: string;
  deepLink?: string;
  isDeepLinkCapable?: boolean;
}

export const SOCIALS = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    handle: "@editby.dhiru",
    url: "https://www.instagram.com/editby.dhiru/",
  },
  threads: {
    id: "threads",
    name: "Threads",
    handle: "@editby.dhiru",
    url: "https://www.threads.com/@editby.dhiru",
  },
  x: {
    id: "x",
    name: "X (Twitter)",
    handle: "@editbydhiru",
    url: "https://x.com/editbydhiru",
  },
  discord: {
    id: "discord",
    name: "Discord",
    userId: "1108795562758770828",
    url: "https://discord.com/users/1108795562758770828",
    deepLink: "discord://-/users/1108795562758770828",
    handle: "User ID: 1108795562758770828",
  },
  email: {
    id: "email",
    name: "Email",
    address: "dhairyakulsange16@gmail.com",
    subject: "Video Editing Inquiry",
    mailto: "mailto:dhairyakulsange16@gmail.com?subject=Video%20Editing%20Inquiry",
  },
  // Placeholders retained as requested
  whatsapp: {
    id: "whatsapp",
    name: "WhatsApp",
    // TODO: Dhairya to replace +919999999999 with his actual WhatsApp phone number
    url: "https://wa.me/919999999999?text=Hi%20Dhairya,%20I%20saw%20your%20portfolio%20and%20want%20to%20discuss%20a%20video%20project",
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    // TODO: Dhairya to replace https://youtube.com/@dhairya_creates with his actual YouTube channel URL
    url: "https://youtube.com/@dhairya_creates",
    handle: "@dhairya_creates",
  },
} as const;

export type SocialPlatform = keyof typeof SOCIALS;
