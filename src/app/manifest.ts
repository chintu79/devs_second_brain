import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dev Second Brain",
    short_name: "DevBrain",
    description: "Your developer knowledge OS — save, organize, and resurface knowledge",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f8f8f7",
    theme_color: "#6366f1",
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  };
}
