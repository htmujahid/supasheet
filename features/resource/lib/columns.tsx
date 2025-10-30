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
} from "lucide-react";

import { METADATA_COLUMNS } from "@/config/database.config";
import {
  ColumnSchema,
  PrimaryKey,
  Relationship,
  TableSchema,
} from "@/lib/database-meta.types";

import { ColumnMetadata } from "../components/fields/types";

export function getColumnCell(columnSchema: ColumnSchema) {
  switch (columnSchema.data_type) {
    case "json":
    case "jsonb":
      return "json";

    case "ARRAY":
      return "array";

    default:
      return "text";
  }
}

export function getColumnMetadata(
  tableSchema: TableSchema | null,
  columnSchema: ColumnSchema,
): ColumnMetadata {
  let format = columnSchema.format?.startsWith("_")
    ? columnSchema.format?.slice(1)
    : columnSchema.format;

  let defaultValue: string | null = null;

  if (columnSchema.default_value === "NULL") {
    defaultValue = null;
  } else if (columnSchema.default_value) {
    defaultValue = columnSchema.default_value;
  } else {
    defaultValue = null;
  }

  const label = columnSchema.name as string;
  const required = columnSchema.is_nullable === false;
  const disabled = columnSchema.is_generated || !columnSchema.is_updatable;
  const isArray = columnSchema.data_type === "ARRAY";
  const isMetadata = METADATA_COLUMNS.includes(label);

  const relationship = (tableSchema?.relationships as Relationship[])?.find(
    (relationship) =>
      relationship.source_column_name === columnSchema.name &&
      relationship.source_schema === columnSchema.schema,
  );

  const isPrimaryKey = (tableSchema?.primary_keys as PrimaryKey[])?.some(
    (key) =>
      key.name === columnSchema.name && key.schema === columnSchema.schema,
  );

  const baseOptions = {
    label,
    defaultValue,
    disabled: disabled,
    required,
    isArray,
    isMetadata,
    isPrimaryKey,
    relationship,
    comment: columnSchema.comment,
    primaryKeys: (tableSchema?.primary_keys as PrimaryKey[]) ?? [],
    table: columnSchema.table as string,
    schema: columnSchema.schema as string,
    options:
      (columnSchema.enums as string[])?.map((option) => ({
        label: option,
        value: option,
      })) ?? [],
  };

  if (format === "file") {
    return {
      ...baseOptions,
      isArray: false, // special case for file upload
      variant: "file",
      icon: <PaperclipIcon className="text-muted-foreground size-4 shrink-0" />,
    };
  }

  if (format === "avatar") {
    return {
      ...baseOptions,
      variant: "avatar",
      icon: <UserIcon className="text-muted-foreground size-4 shrink-0" />,
    };
  }

  if (columnSchema.data_type === "USER-DEFINED") {
    return {
      ...baseOptions,
      icon: (
        <ChevronDownIcon className="text-muted-foreground size-4 shrink-0" />
      ),
      variant: "select",
    };
  }

  switch (format) {
    case "email":
      return {
        ...baseOptions,
        variant: "email",
        icon: <MailIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "tel":
      return {
        ...baseOptions,
        variant: "tel",
        icon: <PhoneIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "url":
      return {
        ...baseOptions,
        variant: "url",
        icon: <LinkIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "rating":
      return {
        ...baseOptions,
        variant: "rating",
        icon: <StarIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "percentage":
      return {
        ...baseOptions,
        variant: "percentage",
        icon: <PercentIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "color":
      return {
        ...baseOptions,
        variant: "color",
        icon: <PaletteIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "duration":
      return {
        ...baseOptions,
        variant: "duration",
        icon: <TimerIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "uuid":
      return {
        ...baseOptions,
        variant: "uuid",
        icon: <HashIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "rich_text":
      return {
        ...baseOptions,
        variant: "rich_text",
        icon: (
          <BaselineIcon className="text-muted-foreground size-4 shrink-0" />
        ),
      };

    case "character":
    case "varchar":
      return {
        ...baseOptions,
        variant: "text",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">ab</code>
        ),
      };

    case "text":
      return {
        ...baseOptions,
        variant: "long_text",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">AB</code>
        ),
      };

    case "bit":
    case "varbit":
      return {
        ...baseOptions,
        variant: "number",
        icon: <BinaryIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "bytea":
      return {
        ...baseOptions,
        variant: "number",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">\x0</code>
        ),
      };

    case "double precision":
    case "decimal":
    case "numeric":
    case "real":
      return {
        ...baseOptions,
        variant: "number",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">1.23</code>
        ),
      };

    case "int8":
    case "bigint":
    case "bigserial":
      return {
        ...baseOptions,
        variant: "number",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">123</code>
        ),
      };

    case "int2":
    case "smallint":
    case "smallserial":
      return {
        ...baseOptions,
        variant: "number",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">123</code>
        ),
      };

    case "int4":
    case "integer":
    case "serial":
      return {
        ...baseOptions,
        variant: "number",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">123</code>
        ),
      };

    case "money":
      return {
        ...baseOptions,
        variant: "money",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">$</code>
        ),
      };

    case "date":
      return {
        ...baseOptions,
        variant: "date",
        icon: (
          <CalendarDaysIcon className="text-muted-foreground size-4 shrink-0" />
        ),
      };

    case "time":
    case "timetz":
      return {
        ...baseOptions,
        variant: "time",
        icon: <ClockIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "timestamptz":
    case "timestamp":
      return {
        ...baseOptions,
        variant: "datetime",
        icon: (
          <CalendarClockIcon className="text-muted-foreground size-4 shrink-0" />
        ),
      };

    case "json":
    case "jsonb":
      return {
        ...baseOptions,
        variant: "json",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">{`{}`}</code>
        ),
      };

    case "bool":
      return {
        ...baseOptions,
        variant: "boolean",
        icon: (
          <ToggleLeftIcon className="text-muted-foreground size-4 shrink-0" />
        ),
      };

    default:
      return {
        ...baseOptions,
        variant: "text",
        icon: null,
      };
  }
}

export function getColumnMeta(columnSchema: ColumnSchema) {
  switch (columnSchema.data_type) {
    case "character":
    case "varchar":
    case "text":
    case "uuid":
    case "bit":
    case "varbit":
    case "bytea":
      return {
        label: columnSchema.name,
        variant: "text",
      };

    case "double precision":
    case "real":
    case "bigint":
    case "bigserial":
    case "integer":
    case "numeric":
    case "smallint":
    case "smallserial":
    case "serial":
    case "money":
      return {
        label: columnSchema.name,
        variant: "number",
      };

    case "date":
    case "timetz":
    case "time":
    case "timestamptz":
    case "timestamp":
      return {
        label: columnSchema.name,
        variant: "date",
      };

    case "json":
    case "jsonb":
      return {
        label: columnSchema.name,
        variant: "text",
      };

    case "boolean":
      return {
        label: columnSchema.name,
        variant: "checkbox",
      };

    case "USER-DEFINED":
      return {
        label: columnSchema.name,
        variant: "multiSelect",
        options:
          (columnSchema.enums as string[])?.map((option) => ({
            label: option,
            value: option,
          })) ?? [],
      };
    default:
      return {
        label: columnSchema.name,
        variant: "text",
      };
  }
}
