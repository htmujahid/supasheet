import { useNavigate } from "@tanstack/react-router"

import {
  Grid3X3Icon,
  ImageIcon,
  SquareKanbanIcon,
  TableIcon,
} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import type { TableMetadata } from "#/lib/database-meta.types"

type MetaItem = NonNullable<TableMetadata["items"]>[number]

interface ResourceViewSwitcherProps {
  schema: string
  resource: string
  metaItems: MetaItem[]
  currentViewId: string
}

export function ResourceViewSwitcher({
  schema,
  resource,
  metaItems,
  currentViewId,
}: ResourceViewSwitcherProps) {
  const navigate = useNavigate()

  if (metaItems.length === 0) return null

  function handleViewChange(value: string | null) {
    if (!value || value === "table") {
      navigate({
        to: "/$schema/resource/$resource",
        params: { schema, resource },
      })
      return
    }
    const item = metaItems.find((i) => i.id === value)
    if (!item) return
    if (item.type === "calendar") {
      navigate({
        to: "/$schema/resource/$resource/calendar/$calendarId",
        params: () => ({ schema, resource, calendarId: item.id }),
        search: { view: "month" },
      })
    } else if (item.type === "kanban") {
      navigate({
        to: "/$schema/resource/$resource/kanban/$kanbanId",
        params: () => ({ schema, resource, kanbanId: item.id }),
        search: { layout: "board" },
      })
    } else if (item.type === "gallery") {
      navigate({
        to: "/$schema/resource/$resource/gallery/$galleryId",
        params: () => ({ schema, resource, galleryId: item.id }),
      })
    }
  }

  return (
    <Select value={currentViewId} onValueChange={handleViewChange}>
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="table">
          <TableIcon />
          Table
        </SelectItem>
        {metaItems.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.type === "kanban" ? (
              <SquareKanbanIcon />
            ) : item.type === "calendar" ? (
              <Grid3X3Icon />
            ) : item.type === "gallery" ? (
              <ImageIcon />
            ) : null}
            {item.name || item.id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
