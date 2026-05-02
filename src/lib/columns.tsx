import {
  BaselineIcon,
  BinaryIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ClockIcon,
  HashIcon,
  LinkIcon,
  MailIcon,
  PaletteIcon,
  PaperclipIcon,
  PercentIcon,
  PhoneIcon,
  StarIcon,
  TimerIcon,
  ToggleLeftIcon,
  UserIcon,
} from "lucide-react"

import { METADATA_COLUMNS } from "#/config/database.config"
import { isTableSchema } from "#/lib/database-meta.types"
import type {
  ColumnSchema,
  PrimaryKey,
  TableSchema,
  ViewSchema,
} from "#/lib/database-meta.types"
import type { ColumnMetadata } from "#/types/fields"

export function getColumnCell(columnSchema: ColumnSchema) {
  switch (columnSchema.data_type) {
    case "json":
    case "jsonb":
      return "json"

    case "ARRAY":
      return "array"

    default:
      return "text"
  }
}

export function getColumnMetadata(
  tableSchema: TableSchema | ViewSchema | null,
  columnSchema: ColumnSchema
): ColumnMetadata {
  const format = columnSchema.format?.startsWith("_")
    ? columnSchema.format?.slice(1)
    : columnSchema.format

  let defaultValue: string | null = null

  if (columnSchema.default_value === "NULL") {
    defaultValue = null
  } else if (columnSchema.default_value) {
    defaultValue = columnSchema.default_value
  } else {
    defaultValue = null
  }

  const label = columnSchema.name as string
  const required =
    columnSchema.is_nullable === false && !columnSchema.default_value
  const disabled = columnSchema.is_generated || !columnSchema.is_updatable
  const isArray = columnSchema.data_type === "ARRAY"
  const isMetadata = METADATA_COLUMNS.includes(label)

  // const relationship = (tableSchema?.relationships as Relationship[])?.find(
  //   (rel) =>
  //     rel.source_column_name === columnSchema.name &&
  //     rel.source_schema === columnSchema.schema
  // )

  const isPrimaryKey =
    tableSchema && isTableSchema(tableSchema)
      ? (tableSchema.primary_keys as PrimaryKey[])?.some(
          (key) =>
            key.name === columnSchema.name && key.schema === columnSchema.schema
        )
      : false

  const baseOptions = {
    label,
    defaultValue,
    disabled: disabled,
    required,
    isArray,
    isMetadata,
    isPrimaryKey,
    comment: columnSchema.comment,
    table: columnSchema.table as string,
    schema: columnSchema.schema as string,
    options:
      (columnSchema.enums as string[])?.map((option) => ({
        label: option,
        value: option,
      })) ?? [],
  }

  if (format === "file") {
    return {
      ...baseOptions,
      isArray: false, // special case for file upload
      variant: "file",
      filterVariant: "text",
      icon: <PaperclipIcon className="size-4 shrink-0 text-muted-foreground" />,
    }
  }

  if (format === "avatar") {
    return {
      ...baseOptions,
      variant: "avatar",
      filterVariant: "text",
      icon: <UserIcon className="size-4 shrink-0 text-muted-foreground" />,
    }
  }

  if (columnSchema.data_type === "USER-DEFINED") {
    return {
      ...baseOptions,
      icon: (
        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
      ),
      filterVariant: "multiSelect",
      variant: "select",
    }
  }

  switch (format) {
    case "email":
      return {
        ...baseOptions,
        variant: "email",
        filterVariant: "text",
        icon: <MailIcon className="size-4 shrink-0 text-muted-foreground" />,
      }

    case "tel":
      return {
        ...baseOptions,
        variant: "tel",
        filterVariant: "text",
        icon: <PhoneIcon className="size-4 shrink-0 text-muted-foreground" />,
      }

    case "url":
      return {
        ...baseOptions,
        variant: "url",
        filterVariant: "text",
        icon: <LinkIcon className="size-4 shrink-0 text-muted-foreground" />,
      }

    case "rating":
      return {
        ...baseOptions,
        variant: "rating",
        filterVariant: "number",
        icon: <StarIcon className="size-4 shrink-0 text-muted-foreground" />,
      }

    case "percentage":
      return {
        ...baseOptions,
        variant: "percentage",
        filterVariant: "number",
        icon: <PercentIcon className="size-4 shrink-0 text-muted-foreground" />,
      }

    case "color":
      return {
        ...baseOptions,
        variant: "color",
        filterVariant: "text",
        icon: <PaletteIcon className="size-4 shrink-0 text-muted-foreground" />,
      }

    case "duration":
      return {
        ...baseOptions,
        variant: "duration",
        filterVariant: "number",
        icon: <TimerIcon className="size-4 shrink-0 text-muted-foreground" />,
      }

    case "uuid":
      return {
        ...baseOptions,
        variant: "uuid",
        filterVariant: "uuid",
        icon: <HashIcon className="size-4 shrink-0 text-muted-foreground" />,
      }

    case "rich_text":
      return {
        ...baseOptions,
        variant: "rich_text",
        filterVariant: "text",
        icon: (
          <BaselineIcon className="size-4 shrink-0 text-muted-foreground" />
        ),
      }

    case "character":
    case "varchar":
    case "bpchar":
      return {
        ...baseOptions,
        variant: "text",
        filterVariant: "text",
        icon: (
          <code className="font-mono text-sm text-muted-foreground">ab</code>
        ),
      }

    case "text":
      return {
        ...baseOptions,
        variant: "long_text",
        filterVariant: "text",
        icon: (
          <code className="font-mono text-sm text-muted-foreground">AB</code>
        ),
      }

    case "bit":
    case "varbit":
      return {
        ...baseOptions,
        variant: "text",
        filterVariant: "text",
        icon: <BinaryIcon className="size-4 shrink-0 text-muted-foreground" />,
      }

    case "bytea":
      return {
        ...baseOptions,
        variant: "text",
        filterVariant: "text",
        icon: (
          <code className="font-mono text-sm text-muted-foreground">\x0</code>
        ),
      }

    case "double precision":
    case "decimal":
    case "numeric":
    case "real":
    case "float4":
    case "float8":
      return {
        ...baseOptions,
        variant: "number",
        filterVariant: "number",
        icon: (
          <code className="font-mono text-sm text-muted-foreground">1.23</code>
        ),
      }

    case "int8":
    case "bigint":
    case "bigserial":
      return {
        ...baseOptions,
        variant: "number",
        filterVariant: "number",
        icon: (
          <code className="font-mono text-sm text-muted-foreground">123</code>
        ),
      }

    case "int2":
    case "smallint":
    case "smallserial":
      return {
        ...baseOptions,
        variant: "number",
        filterVariant: "number",
        icon: (
          <code className="font-mono text-sm text-muted-foreground">123</code>
        ),
      }

    case "int4":
    case "integer":
    case "serial":
      return {
        ...baseOptions,
        variant: "number",
        filterVariant: "number",
        icon: (
          <code className="font-mono text-sm text-muted-foreground">123</code>
        ),
      }

    case "money":
      return {
        ...baseOptions,
        variant: "money",
        filterVariant: "number",
        icon: (
          <code className="font-mono text-sm text-muted-foreground">$</code>
        ),
      }

    case "date":
      return {
        ...baseOptions,
        variant: "date",
        filterVariant: "date",
        icon: (
          <CalendarDaysIcon className="size-4 shrink-0 text-muted-foreground" />
        ),
      }

    case "time":
      return {
        ...baseOptions,
        variant: "time",
        filterVariant: "time",
        icon: <ClockIcon className="size-4 shrink-0 text-muted-foreground" />,
      }
    case "timetz":
      return {
        ...baseOptions,
        variant: "time",
        filterVariant: "timetz",
        icon: <ClockIcon className="size-4 shrink-0 text-muted-foreground" />,
      }

    case "timestamptz":
      return {
        ...baseOptions,
        variant: "datetime",
        filterVariant: "timestamptz",
        icon: (
          <CalendarClockIcon className="size-4 shrink-0 text-muted-foreground" />
        ),
      }
    case "timestamp":
      return {
        ...baseOptions,
        variant: "datetime",
        filterVariant: "timestamp",
        icon: (
          <CalendarClockIcon className="size-4 shrink-0 text-muted-foreground" />
        ),
      }

    case "json":
    case "jsonb":
      return {
        ...baseOptions,
        variant: "json",
        filterVariant: "text",
        icon: (
          <code className="font-mono text-sm text-muted-foreground">{`{}`}</code>
        ),
      }

    case "bool":
      return {
        ...baseOptions,
        variant: "boolean",
        filterVariant: "boolean",
        icon: (
          <ToggleLeftIcon className="size-4 shrink-0 text-muted-foreground" />
        ),
      }

    default:
      return {
        ...baseOptions,
        variant: "text",
        filterVariant: "text",
        icon: null,
      }
  }
}

// export function getColumnFilterData(columnSchema: ColumnSchema): ColumnMeta {
//   if (columnSchema.data_type === "USER-DEFINED") {
//     return {
//       label: columnSchema.name as string,
//       variant: "multiSelect",
//       options:
//         (columnSchema.enums as string[])?.map((option) => ({
//           label: option,
//           value: option,
//         })) ?? [],
//     }
//   }

//   switch (columnSchema.format) {
//     case "uuid":
//       return {
//         label: columnSchema.name as string,
//         variant: "uuid",
//       }
//     case "character":
//     case "varchar":
//     case "bpchar":
//     case "text":
//     case "bit":
//     case "varbit":
//     case "bytea":
//       return {
//         label: columnSchema.name as string,
//         variant: "text",
//       }

//     case "double precision":
//     case "real":
//     case "float4":
//     case "float8":
//     case "decimal":
//     case "bigint":
//     case "bigserial":
//     case "integer":
//     case "numeric":
//     case "smallint":
//     case "smallserial":
//     case "serial":
//     case "money":
//       return {
//         label: columnSchema.name as string,
//         variant: "number",
//       }

//     case "date":
//       return {
//         label: columnSchema.name as string,
//         variant: "date",
//       }
//     case "timetz":
//       return {
//         label: columnSchema.name as string,
//         variant: "timetz",
//       }
//     case "time":
//       return {
//         label: columnSchema.name as string,
//         variant: "time",
//       }
//     case "timestamptz":
//       return {
//         label: columnSchema.name as string,
//         variant: "timestamptz",
//       }
//     case "timestamp":
//       return {
//         label: columnSchema.name as string,
//         variant: "timestamp",
//       }

//     case "json":
//     case "jsonb":
//       return {
//         label: columnSchema.name as string,
//         variant: "text",
//       }

//     case "boolean":
//       return {
//         label: columnSchema.name as string,
//         variant: "boolean",
//       }

//     default:
//       return {
//         label: columnSchema.name as string,
//         variant: "text",
//       }
//   }
// }
