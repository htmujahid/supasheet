import { ArrowLeftIcon } from "lucide-react"

import { Button } from "#/components/ui/button"

export function ResultBar({
  summary,
  onNewQuery,
}: {
  summary: string
  onNewQuery: () => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background px-4 py-3">
      <p className="min-w-0 text-sm text-muted-foreground">{summary}</p>
      <Button variant="outline" size="sm" onClick={onNewQuery}>
        <ArrowLeftIcon />
        New query
      </Button>
    </div>
  )
}
