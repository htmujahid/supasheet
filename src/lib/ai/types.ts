export type MutationKind = "insert" | "update" | "delete"

export type AIResponse =
  | { type: "json"; value: Record<string, unknown>[]; summary: string }
  | { type: "scalar"; value: string; summary: string }
  | { type: "text"; value: null; summary: string }
  | {
      type: "mutation_preview"
      kind: MutationKind
      value: Record<string, unknown>[]
      mutationSql: string
      summary: string
    }
  | {
      type: "mutation_result"
      kind: MutationKind
      value: Record<string, unknown>[]
      summary: string
    }

export type ChatMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; result: AIResponse }
