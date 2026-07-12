import { suggestCategory, suggestTags, summarizeContent } from "@/lib/ai";

export interface AIService {
  suggestCategory(title: string, content: string, categories: string[]): Promise<string>;
  suggestTags(title: string, content: string): Promise<string[]>;
  summarizeContent(content: string): Promise<string>;
}

export const defaultAIService: AIService = {
  suggestCategory,
  suggestTags,
  summarizeContent,
};
