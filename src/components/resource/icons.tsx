import {
  BinaryIcon,
  BracesIcon,
  CalendarClockIcon,
  CalendarIcon,
  ClockIcon,
  HashIcon,
  KeyRoundIcon,
  TextIcon,
  ToggleLeftIcon,
} from "lucide-react"

import type { ColumnSchema, TableSchema } from "#/lib/database-meta.types"

export function getDataTypeIcon(
  _tableSchema: TableSchema | null,
  col: ColumnSchema
) {
  const fmt = col.format ?? ""
  if (col.is_identity)
    return <KeyRoundIcon className="size-3.5 shrink-0 text-muted-foreground" />
  if (fmt === "bool")
    return (
      <ToggleLeftIcon className="size-3.5 shrink-0 text-muted-foreground" />
    )
  if (["int2", "int4", "int8", "float4", "float8", "numeric"].includes(fmt))
    return <HashIcon className="size-3.5 shrink-0 text-muted-foreground" />
  if (fmt === "date")
    return <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
  if (fmt === "time" || fmt === "timetz")
    return <ClockIcon className="size-3.5 shrink-0 text-muted-foreground" />
  if (fmt === "timestamp" || fmt === "timestamptz")
    return (
      <CalendarClockIcon className="size-3.5 shrink-0 text-muted-foreground" />
    )
  if (fmt === "json" || fmt === "jsonb")
    return <BracesIcon className="size-3.5 shrink-0 text-muted-foreground" />
  if (fmt === "uuid")
    return <BinaryIcon className="size-3.5 shrink-0 text-muted-foreground" />
  return <TextIcon className="size-3.5 shrink-0 text-muted-foreground" />
}
