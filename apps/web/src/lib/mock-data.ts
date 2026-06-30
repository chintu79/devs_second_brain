export type GrowthIndicator = "hot" | "trending" | "rising" | "stable" | "new";

export interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  topics: string[];
  category: string;
  growthIndicator: GrowthIndicator;
  useCases: string[];
  keyFeatures: string[];
  highlight?: string;
  saved: boolean;
  bookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
