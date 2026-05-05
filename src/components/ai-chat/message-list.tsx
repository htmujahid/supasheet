import { useEffect, useRef } from "react"

import { Spinner } from "#/components/ui/spinner"
import type { ChatMessage } from "#/lib/ai/types"

import { MessageBubble } from "./message-bubble"
import { ResultCard } from "./result-card"

export function MessageList({
  messages,
  pending,
}: {
  messages: ChatMessage[]
  pending: boolean
}) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages.length, pending])

  if (messages.length === 0 && !pending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-md text-center text-sm text-muted-foreground">
          Ask a question about your data. Try “How many users do we have?” or
          “List the 10 most recent orders”.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <MessageBubble key={i} content={m.content} />
          ) : (
            <ResultCard key={i} result={m.result} />
          )
        )}
        {pending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner />
            Thinking…
          </div>
        ) : null}
        <div ref={endRef} />
      </div>
    </div>
  )
}
