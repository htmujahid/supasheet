import { useNavigate } from "@tanstack/react-router"

import type { Row } from "@tanstack/react-table"

import { useEditRecordSheet } from "#/components/resource/sheet/resource-form-sheet-provider"
import { Checkbox } from "#/components/ui/checkbox"
import type {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  PrimaryKey,
} from "#/lib/database-meta.types"
import { getPkValue } from "#/lib/fields"
import { cn } from "#/lib/utils"

import { readField } from "./read-field"
import type { ListView } from "./resource-list"

interface ResourceListRowProps<S extends DatabaseSchemas> {
  row: Row<Record<string, unknown>>
  listView: ListView
  schema: S
  resource: DatabaseTables<S> | DatabaseViews<S>
  primaryKeys: PrimaryKey[]
  canUpdate: boolean
}

export function ResourceListRow<S extends DatabaseSchemas>({
  row,
  listView,
  schema,
  resource,
  primaryKeys,
  canUpdate,
}: ResourceListRowProps<S>) {
  const navigate = useNavigate()
  const { inlineForm, open: openEdit } = useEditRecordSheet()
  const data = row.original

  const titleValue = readField(data, listView.title)
  const descriptionValue = readField(data, listView.description)
  const field1Value = readField(data, listView.field1)
  const field2Value = readField(data, listView.field2)

  function handleClick() {
    if (canUpdate && inlineForm) {
      const pk = Object.fromEntries(
        primaryKeys.map((k) => [k.name, data[k.name]])
      )
      openEdit(pk)
      return
    }
    const resourceId = getPkValue(data, primaryKeys)
    if (canUpdate) {
      navigate({
        to: "/$schema/resource/$resource/$resourceId/update",
        params: { schema, resource, resourceId },
      })
    } else {
      navigate({
        to: "/$schema/resource/$resource/$resourceId/detail",
        params: { schema, resource, resourceId },
      })
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleClick()
        }
      }}
      className={cn(
        "flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/40",
        row.getIsSelected() && "bg-muted/60"
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(!!checked)}
          aria-label="Select row"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">
          {titleValue ?? "Untitled"}
        </div>
        {descriptionValue && (
          <div className="truncate text-xs text-muted-foreground">
            {descriptionValue}
          </div>
        )}
      </div>
      <div className="hidden min-w-0 flex-1 flex-col gap-1 text-sm sm:flex">
        {field1Value && (
          <div className="truncate text-muted-foreground">{field1Value}</div>
        )}
        {field2Value && (
          <div className="truncate text-muted-foreground">{field2Value}</div>
        )}
      </div>
    </div>
  )
}
