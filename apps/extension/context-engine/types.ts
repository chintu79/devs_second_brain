export interface SiteMeta {
  url: string;
  hostname: string;
  title: string;
  description: string;
  favicon: string;
  siteName: string;
  ogImage: string;
  selectedText: string;
}

export interface Action {
  id: string;
  label: string;
  description: string;
  icon: string;
  tab: "resource" | "note";
}
