export type AIResponse =
  | { type: "json"; value: Record<string, unknown>[]; summary: string }
  | { type: "scalar"; value: string; summary: string }
  | { type: "text"; value: null; summary: string }

export type ChatMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; result: AIResponse }
