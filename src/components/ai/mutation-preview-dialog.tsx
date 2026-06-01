import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#/components/ui/alert-dialog"
import { Spinner } from "#/components/ui/spinner"
import type { MutationKind } from "#/lib/ai/types"

type MutationPreview = {
  kind: MutationKind
  value: Record<string, unknown>[]
  mutationSql: string
  summary: string
}

const ACTION_LABEL: Record<MutationKind, string> = {
  insert: "Insert",
  update: "Update",
  delete: "Delete",
}

const TITLE: Record<MutationKind, string> = {
  insert: "Confirm insert",
  update: "Confirm update",
  delete: "Confirm delete",
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return ""
  if (typeof v === "object") return JSON.stringify(v)
  return String(v)
}

export function MutationPreviewDialog({
  preview,
  pending,
  onConfirm,
  onCancel,
}: {
  preview: MutationPreview | null
  pending: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const open = preview !== null
  const rows = preview?.value ?? []
  const columns = rows.length > 0 ? Object.keys(rows[0]) : []

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && !pending && onCancel()}>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {preview ? TITLE[preview.kind] : ""}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {preview?.summary}{" "}
            {rows.length > 0 && (
              <span className="text-muted-foreground">
                ({rows.length} row{rows.length === 1 ? "" : "s"})
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {rows.length > 0 ? (
          <div className="max-h-96 overflow-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 sticky top-0">
                <tr>
                  {columns.map((c) => (
                    <th
                      key={c}
                      className="px-3 py-2 text-left font-medium text-xs uppercase tracking-wide text-muted-foreground"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-t">
                    {columns.map((c) => (
                      <td key={c} className="px-3 py-2 font-mono text-xs">
                        {formatCell(row[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
            No rows matched the preview query.
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending} onClick={onCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction disabled={pending || rows.length === 0} onClick={onConfirm}>
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> Running…
              </span>
            ) : (
              `${preview ? ACTION_LABEL[preview.kind] : "Confirm"} ${rows.length} row${rows.length === 1 ? "" : "s"}`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
