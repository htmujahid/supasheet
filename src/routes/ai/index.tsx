import { useState } from "react"

import { createFileRoute } from "@tanstack/react-router"

import { useMutation } from "@tanstack/react-query"

import { SparklesIcon, TableIcon } from "lucide-react"
import { toast } from "sonner"

import { NonTabularDialog } from "#/components/ai/non-tabular-dialog"
import { QueryBar } from "#/components/ai/query-bar"
import { ResultDataTable } from "#/components/ai/result-data-table"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import { Spinner } from "#/components/ui/spinner"
import { askAI } from "#/lib/ai/chat"
import type { AIResponse, ChatMessage } from "#/lib/ai/types"

export const Route = createFileRoute("/ai/")({
  component: AIPage,
})

type DisplayResult =
  | { kind: "table"; rows: Record<string, unknown>[]; summary: string }
  | { kind: "note"; summary: string; value?: string }

function toDisplay(response: AIResponse): DisplayResult {
  if (response.type === "json") {
    return { kind: "table", rows: response.value, summary: response.summary }
  }
  if (response.type === "scalar") {
    return {
      kind: "note",
      summary: response.summary,
      value: response.value,
    }
  }
  return { kind: "note", summary: response.summary }
}

function AIPage() {
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [result, setResult] = useState<DisplayResult | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const [pendingNonTabular, setPendingNonTabular] = useState<{
    question: string
    response: AIResponse
  } | null>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: (question: string) => askAI(question, history),
    onSuccess: (response, question) => {
      if (response.type === "json") {
        setHistory((prev) => [
          ...prev,
          { role: "user", content: question },
          { role: "assistant", content: response.summary, result: response },
        ])
        setResult(toDisplay(response))
        setResetSignal((s) => s + 1)
        return
      }
      setPendingNonTabular({ question, response })
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Request failed"
      toast.error(message)
    },
  })

  function acceptNonTabular() {
    if (!pendingNonTabular) return
    const { question, response } = pendingNonTabular
    setHistory((prev) => [
      ...prev,
      { role: "user", content: question },
      { role: "assistant", content: response.summary, result: response },
    ])
    setResult(toDisplay(response))
    setResetSignal((s) => s + 1)
    setPendingNonTabular(null)
  }

  function dismissNonTabular() {
    setPendingNonTabular(null)
  }

  return (
    <div className="flex flex-1 flex-col pb-32">
      <div className="flex flex-1 flex-col">
        {isPending && result === null ? (
          <PendingState />
        ) : result === null ? (
          <Empty className="flex-1">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SparklesIcon />
              </EmptyMedia>
              <EmptyTitle>Ask your data anything</EmptyTitle>
              <EmptyDescription>
                Results return as a sortable, exportable table. Try “Top 10
                customers by revenue this month”.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : result.kind === "table" ? (
          <ResultDataTable rows={result.rows} summary={result.summary} />
        ) : (
          <NoteResult summary={result.summary} value={result.value} />
        )}
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-background via-background/95 to-transparent px-4 pt-8 pb-6">
        <div className="pointer-events-auto w-full max-w-3xl">
          <QueryBar
            onSubmit={mutate}
            disabled={isPending}
            pending={isPending}
            resetSignal={resetSignal}
          />
        </div>
      </div>
      <NonTabularDialog
        response={pendingNonTabular?.response ?? null}
        onShowAnyway={acceptNonTabular}
        onRefine={dismissNonTabular}
      />
    </div>
  )
}

function PendingState() {
  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Thinking…</EmptyTitle>
        <EmptyDescription>
          Running your query against the data.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function NoteResult({ summary, value }: { summary: string; value?: string }) {
  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TableIcon />
        </EmptyMedia>
        <EmptyTitle>{value ?? "Non-tabular result"}</EmptyTitle>
        <EmptyDescription>{summary}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
