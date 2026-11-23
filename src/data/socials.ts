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
} as const;

export type SocialPlatform = keyof typeof SOCIALS;
