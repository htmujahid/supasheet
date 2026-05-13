"use client"

import { useQueryClient } from "@tanstack/react-query"

import {
  MoreHorizontalIcon,
  PlusIcon,
  RefreshCwIcon,
  TableIcon,
  UploadIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "#/components/ui/button"
import { ButtonGroup } from "#/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import type { ColumnSchema } from "#/lib/database-meta.types"
import { NewRecordTrigger } from "#/components/resource/sheet/new-record-trigger"
import { useImportSheet } from "#/components/resource/sheet/resource-form-sheet-provider"

interface RecordActionsProps {
  schema: string
  resource: string
  columnsSchema: ColumnSchema[]
}

function downloadTemplate(resource: string, columnsSchema: ColumnSchema[]) {
  const headers = columnsSchema
    .map((c) => c.name ?? "")
    .filter(Boolean)
    .join(",")
  const blob = new Blob([headers + "\n"], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${resource}_template.csv`
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function ResourceActions({
  schema,
  resource,
  columnsSchema,
}: RecordActionsProps) {
  const queryClient = useQueryClient()
  const { open: openImport } = useImportSheet()

  function handleRefresh() {
    queryClient.invalidateQueries({
      queryKey: ["supasheet", "resource-data", schema, resource],
    })
    toast.success("Data refreshed")
  }

  return (
    <ButtonGroup>
      <NewRecordTrigger size="sm">
        <PlusIcon className="mr-1.5 size-3.5" />
        New record
      </NewRecordTrigger>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button size="icon-sm" aria-label="More Options">
              <MoreHorizontalIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={openImport}>
              <UploadIcon />
              Import CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => downloadTemplate(resource, columnsSchema)}
            >
              <TableIcon />
              Download template
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleRefresh}>
              <RefreshCwIcon />
              Refresh
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
