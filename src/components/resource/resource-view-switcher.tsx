import { useNavigate } from "@tanstack/react-router"

import {
  ChevronDownIcon,
  Grid3X3Icon,
  ImageIcon,
  LayoutGridIcon,
  SquareKanbanIcon,
  TableIcon,
} from "lucide-react"

import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import type {
  DatabaseSchemas,
  DatabaseTables,
  TableMetadata,
} from "#/lib/database-meta.types"

type MetaItem = NonNullable<TableMetadata["items"]>[number]

const builtInViews = [
  { id: "table", label: "Table View", icon: <TableIcon className="size-3" /> },
  {
    id: "grid",
    label: "Grid View",
    icon: <LayoutGridIcon className="size-3" />,
  },
]

function getMetaItemIcon(item: MetaItem) {
  if (item.type === "kanban") return <SquareKanbanIcon className="size-3" />
  if (item.type === "calendar") return <Grid3X3Icon className="size-3" />
  if (item.type === "gallery") return <ImageIcon className="size-3" />
  return null
}

export function ResourceViewSwitcher<S extends DatabaseSchemas>({
  schema,
  resource,
  metaItems,
  currentViewId,
}: {
  schema: S
  resource: DatabaseTables<S>
  metaItems: MetaItem[]
  currentViewId: string
}) {
  const navigate = useNavigate()

  const currentBuiltIn = builtInViews.find((v) => v.id === currentViewId)
  const currentMeta = metaItems.find((i) => i.id === currentViewId)
  const currentIcon =
    currentBuiltIn?.icon ?? (currentMeta ? getMetaItemIcon(currentMeta) : null)
  const currentLabel =
    currentBuiltIn?.label ?? currentMeta?.name ?? currentMeta?.id ?? "View"

  function handleViewChange(value: string) {
    if (value === "table") {
      navigate({
        to: "/$schema/resource/$resource",
        params: { schema, resource },
      })
      return
    }
    if (value === "grid") {
      navigate({
        to: "/$schema/resource/$resource/grid",
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
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button size="sm" variant="outline" />}>
        {currentIcon}
        <span className="truncate font-medium">{currentLabel}</span>
        <ChevronDownIcon className="size-3.5 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 rounded-lg">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Views</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuRadioGroup
          value={currentViewId}
          onValueChange={handleViewChange}
        >
          {builtInViews.map((view) => (
            <DropdownMenuRadioItem key={view.id} value={view.id}>
              {view.icon}
              {view.label}
            </DropdownMenuRadioItem>
          ))}
          {metaItems.length > 0 && <DropdownMenuSeparator />}
          {metaItems.map((item) => (
            <DropdownMenuRadioItem key={item.id} value={item.id}>
              {getMetaItemIcon(item)}
              {item.name || item.id}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
