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
  | {
      kind: "table"
      rows: Record<string, unknown>[]
      summary: string
      question: string
    }
  | {
      kind: "note"
      summary: string
      value?: string
      question: string
    }

function toDisplay(response: AIResponse, question: string): DisplayResult {
  if (response.type === "json") {
    return {
      kind: "table",
      rows: response.value,
      summary: response.summary,
      question,
    }
  }
  if (response.type === "scalar") {
    return {
      kind: "note",
      summary: response.summary,
      value: response.value,
      question,
    }
  }
  return { kind: "note", summary: response.summary, question }
}

function AIPage() {
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [result, setResult] = useState<DisplayResult | null>(null)
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
        setResult(toDisplay(response, question))
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
    setResult(toDisplay(response, question))
    setPendingNonTabular(null)
  }

  function dismissNonTabular() {
    setPendingNonTabular(null)
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <QueryBar onSubmit={mutate} disabled={isPending} pending={isPending} />
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
          <ResultDataTable
            rows={result.rows}
            summary={result.summary}
            question={result.question}
          />
        ) : (
          <NoteResult
            summary={result.summary}
            value={result.value}
            question={result.question}
          />
        )}
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

function NoteResult({
  summary,
  value,
  question,
}: {
  summary: string
  value?: string
  question: string
}) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <QuestionLabel question={question} />
      <Empty className="flex-1">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TableIcon />
          </EmptyMedia>
          <EmptyTitle>{value ?? "Non-tabular result"}</EmptyTitle>
          <EmptyDescription>{summary}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}

function QuestionLabel({ question }: { question: string }) {
  return (
    <p className="truncate text-xs text-muted-foreground">
      <span className="font-medium text-foreground">You asked:</span> {question}
    </p>
  )
}
