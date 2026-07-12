export interface CapturePayload {
  provider: string;
  capabilities: string[];
  page: {
    url: string;
    title: string;
    description: string;
    siteName: string;
    favicon: string;
    ogImage: string;
  };
  selection?: {
    text: string;
  };
  userInput?: {
    thought: string;
  };
  metadata: Record<string, unknown>;
}

export interface LearningContext {
  saved: boolean;
  count: number;
  types: Array<{ type: string; count: number }>;
  relatedNotes: number;
  relatedResources: number;
}

export interface ExtensionMessage {
  type: "getPageData" | "showToast" | "showInlinePopup" | "showContextPopup" | "capture" | "get-context" | "check-queue" | "ping";
  payload?: unknown;
}
