"use client"

import * as React from "react"

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"

import {
  AlertCircleIcon,
  CheckCircle2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "#/components/ui/drawer"
import { Progress } from "#/components/ui/progress"
import { ScrollArea } from "#/components/ui/scroll-area"
import { useIsMobile } from "#/hooks/use-mobile"
import {
  IMPORT_BATCH_SIZE,
  buildColumnMap,
  coerceImportRow,
  matchHeaders,
  parseCSV,
} from "#/lib/import"
import type { ParsedCSV } from "#/lib/import"
import {
  columnsSchemaQueryOptions,
  insertBulkResourceMutationOptions,
} from "#/lib/supabase/data/resource"
import { cn } from "#/lib/utils"

import { ResourceFormDrawerSkeleton } from "./resource-form-drawer-skeleton"

interface ResourceImportDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schema: string
  resource: string
}

export function ResourceImportDrawer(props: ResourceImportDrawerProps) {
  const isMobile = useIsMobile()
  const direction = isMobile ? "bottom" : "right"

  return (
    <Drawer
      open={props.open}
      onOpenChange={props.onOpenChange}
      direction={direction}
    >
      <DrawerContent
        className={cn(
          "gap-0",
          direction === "right" && "h-full w-full sm:max-w-lg!"
        )}
      >
        <React.Suspense fallback={<ResourceFormDrawerSkeleton />}>
          <ResourceImportDrawerBody {...props} />
        </React.Suspense>
        <DrawerClose asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-3 right-3"
            aria-label="Close"
          >
            <XIcon />
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}

function ResourceImportDrawerBody({
  onOpenChange,
  schema,
  resource,
}: ResourceImportDrawerProps) {
  const queryClient = useQueryClient()
  const { data: columnsSchema = [] } = useSuspenseQuery(
    columnsSchemaQueryOptions(schema as never, resource as never)
  )

  const [parsed, setParsed] = React.useState<ParsedCSV | null>(null)
  const [filename, setFilename] = React.useState("")
  const [progress, setProgress] = React.useState(0)
  const [importing, setImporting] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const [errors, setErrors] = React.useState<string[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const columnMap = React.useMemo(
    () => buildColumnMap(columnsSchema),
    [columnsSchema]
  )

  const { matched: matchedHeaders, unmatched: unmatchedHeaders } =
    React.useMemo(
      () =>
        parsed
          ? matchHeaders(parsed.headers, columnsSchema)
          : { matched: [], unmatched: [] },
      [parsed, columnsSchema]
    )

  const { mutateAsync: insertBulk } = useMutation(
    insertBulkResourceMutationOptions(schema as never, resource as never)
  )

  function reset() {
    setParsed(null)
    setFilename("")
    setProgress(0)
    setDone(false)
    setErrors([])
  }

  function handleFile(file: File) {
    setFilename(file.name)
    setParsed(null)
    setDone(false)
    setErrors([])
    setProgress(0)
    const reader = new FileReader()
    reader.onload = (e) => setParsed(parseCSV(e.target?.result as string))
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function handleImport() {
    if (!parsed || matchedHeaders.length === 0) return
    setImporting(true)
    setErrors([])
    const errs: string[] = []
    let inserted = 0

    const coercedRows = parsed.rows.map((rawRow) =>
      coerceImportRow(rawRow, matchedHeaders, columnMap)
    )

    const batches: Record<string, unknown>[][] = []
    for (let i = 0; i < coercedRows.length; i += IMPORT_BATCH_SIZE) {
      batches.push(coercedRows.slice(i, i + IMPORT_BATCH_SIZE))
    }

    for (let b = 0; b < batches.length; b++) {
      const batch = batches[b]
      const start = b * IMPORT_BATCH_SIZE + 1
      const end = start + batch.length - 1
      try {
        await insertBulk(batch)
        inserted += batch.length
      } catch (err) {
        errs.push(
          `Rows ${start}–${end}: ${err instanceof Error ? err.message : "Unknown error"}`
        )
      }
      setProgress(Math.round(((b + 1) / batches.length) * 100))
    }

    setErrors(errs)
    setImporting(false)
    setDone(true)

    if (inserted > 0) {
      queryClient.invalidateQueries({
        queryKey: ["supasheet", "resource-data", schema, resource],
      })
      toast.success(
        `Imported ${inserted} of ${parsed.rows.length} record${inserted !== 1 ? "s" : ""}`
      )
    }
    if (errs.length > 0) {
      toast.error(
        `${errs.length} batch${errs.length !== 1 ? "es" : ""} failed to import`
      )
    }
  }

  function handleOpenChange(next: boolean) {
    if (importing) return
    onOpenChange(next)
    if (!next) setTimeout(reset, 200)
  }

  const previewRows = parsed?.rows.slice(0, 5) ?? []

  return (
    <>
      <DrawerHeader className="border-b p-4 pr-10">
        <DrawerTitle>Import CSV</DrawerTitle>
        <DrawerDescription>
          Upload a CSV file to import records into{" "}
          <strong className="text-foreground">{resource}</strong>. Column
          headers must match table column names.
        </DrawerDescription>
      </DrawerHeader>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {!parsed ? (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors hover:border-primary/50"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <UploadIcon className="text-muted-foreground size-8" />
            <div className="text-sm">
              <span className="text-muted-foreground">
                Drag & drop a CSV file here, or{" "}
              </span>
              <button
                type="button"
                className="text-primary underline-offset-4 hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>
            </div>
            <p className="text-muted-foreground text-xs">Supports .csv files</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
                e.target.value = ""
              }}
            />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2 text-sm">
              <span className="text-muted-foreground truncate">{filename}</span>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground shrink-0 text-xs underline-offset-2 hover:underline"
                onClick={reset}
                disabled={importing}
              >
                Change file
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-muted/50 rounded-md p-3">
                <p className="text-muted-foreground text-xs">Rows</p>
                <p className="font-medium">{parsed.rows.length}</p>
              </div>
              <div className="bg-muted/50 rounded-md p-3">
                <p className="text-muted-foreground text-xs">Columns matched</p>
                <p className="font-medium">
                  {matchedHeaders.length}{" "}
                  <span className="text-muted-foreground font-normal">
                    / {parsed.headers.length}
                  </span>
                </p>
              </div>
            </div>

            {unmatchedHeaders.length > 0 && (
              <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-400">
                <AlertCircleIcon className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  Skipped columns:{" "}
                  <strong>{unmatchedHeaders.join(", ")}</strong>
                </span>
              </div>
            )}

            {matchedHeaders.length === 0 ? (
              <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircleIcon className="size-4 shrink-0" />
                No CSV columns matched any table columns.
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <p className="text-muted-foreground text-xs">
                  Preview (first {Math.min(5, previewRows.length)} rows)
                </p>
                <ScrollArea className="rounded-md border">
                  <div className="min-w-max">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          {matchedHeaders.map((h) => (
                            <th
                              key={h}
                              className="px-3 py-2 text-left font-medium whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.map((row, i) => (
                          <tr key={i} className="border-t">
                            {matchedHeaders.map((h) => (
                              <td
                                key={h}
                                className="text-muted-foreground max-w-[180px] truncate px-3 py-1.5"
                              >
                                {row[h]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
                {parsed.rows.length > 5 && (
                  <p className="text-muted-foreground text-xs">
                    + {parsed.rows.length - 5} more rows
                  </p>
                )}
              </div>
            )}

            {importing && (
              <Progress value={progress}>
                <span className="text-muted-foreground text-xs">
                  Importing… {progress}%
                </span>
              </Progress>
            )}

            {done && !importing && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2Icon className="size-4 shrink-0" />
                Import complete — {parsed.rows.length - errors.length} of{" "}
                {parsed.rows.length} records inserted.
              </div>
            )}

            {errors.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-destructive text-xs font-medium">
                  Errors ({errors.length})
                </p>
                <ScrollArea className="bg-destructive/5 max-h-32 rounded-md border border-destructive/20 p-2">
                  {errors.map((e, i) => (
                    <p key={i} className="text-destructive text-xs">
                      {e}
                    </p>
                  ))}
                </ScrollArea>
              </div>
            )}
          </>
        )}
      </div>

      <DrawerFooter className="border-t">
        {!parsed && (
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
        )}
        {parsed && !done && (
          <>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={importing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={
                importing ||
                matchedHeaders.length === 0 ||
                parsed.rows.length === 0
              }
            >
              {importing
                ? "Importing…"
                : `Import ${parsed.rows.length} record${parsed.rows.length !== 1 ? "s" : ""}`}
            </Button>
          </>
        )}
        {parsed && done && (
          <>
            <Button variant="outline" onClick={reset}>
              Import another
            </Button>
            <Button onClick={() => handleOpenChange(false)}>Done</Button>
          </>
        )}
      </DrawerFooter>
    </>
  )
}
