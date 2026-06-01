import { useState } from "react"

import { createFileRoute } from "@tanstack/react-router"

import { useMutation } from "@tanstack/react-query"

import { PlusIcon, SparklesIcon, TableIcon } from "lucide-react"
import { toast } from "sonner"

import { NonTabularDialog } from "#/components/ai/non-tabular-dialog"
import { QueryBar } from "#/components/ai/query-bar"
import { ResultDataTable } from "#/components/ai/result-data-table"
import { Button } from "#/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
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
  const [lastQuestion, setLastQuestion] = useState<string | null>(null)
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
        setLastQuestion(question)
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
    setLastQuestion(question)
    setPendingNonTabular(null)
  }

  function dismissNonTabular() {
    setPendingNonTabular(null)
  }

  function newQuery() {
    setResult(null)
    setLastQuestion(null)
  }

  return (
    <div className="flex flex-1 flex-col">
      {result === null ? (
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 py-10">
          <Empty>
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
          <div className="w-full">
            <QueryBar
              onSubmit={mutate}
              disabled={isPending}
              pending={isPending}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4">
          <ResultHeader question={lastQuestion} onNewQuery={newQuery} />
          {result.kind === "table" ? (
            <ResultDataTable rows={result.rows} summary={result.summary} />
          ) : (
            <NoteResult summary={result.summary} value={result.value} />
          )}
        </div>
      )}
      <NonTabularDialog
        response={pendingNonTabular?.response ?? null}
        onShowAnyway={acceptNonTabular}
        onRefine={dismissNonTabular}
      />
    </div>
  )
}

function ResultHeader({
  question,
  onNewQuery,
}: {
  question: string | null
  onNewQuery: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border bg-muted/40 px-3 py-2">
      <div className="flex min-w-0 items-start gap-2">
        <SparklesIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="truncate text-sm">
          {question ?? "Result"}
        </p>
      </div>
      <Button size="sm" variant="outline" onClick={onNewQuery}>
        <PlusIcon />
        New question
      </Button>
    </div>
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
