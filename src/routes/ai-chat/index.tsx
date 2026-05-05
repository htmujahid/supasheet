import { useState } from "react"

import { createFileRoute } from "@tanstack/react-router"

import { useMutation } from "@tanstack/react-query"

import { toast } from "sonner"

import { ChatInput } from "#/components/ai-chat/chat-input"
import { MessageList } from "#/components/ai-chat/message-list"
import { askAI } from "#/lib/ai/chat"
import type { ChatMessage } from "#/lib/ai/types"

export const Route = createFileRoute("/ai-chat/")({
  component: ChatPage,
})

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const { mutate, isPending } = useMutation({
    mutationFn: (question: string) => askAI(question, messages),
    onMutate: (question) => {
      setMessages((prev) => [...prev, { role: "user", content: question }])
    },
    onSuccess: (result) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.summary, result },
      ])
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Request failed"
      toast.error(message)
    },
  })

  return (
    <div className="absolute inset-0 flex flex-col">
      <MessageList messages={messages} pending={isPending} />
      <ChatInput onSubmit={mutate} disabled={isPending} />
    </div>
  )
}
