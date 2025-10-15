import {
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

import { ColumnSchema } from "@/lib/database-meta.types";

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

export function getColumnMetadata(columnSchema: ColumnSchema): ColumnMetadata {
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

  const baseOptions = {
    label,
    defaultValue,
    disabled,
    required,
    isArray,
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
      type: "file",
      icon: <PaperclipIcon className="text-muted-foreground size-4 shrink-0" />,
    };
  }

  if (format === "avatar") {
    return {
      ...baseOptions,
      type: "avatar",
      icon: <UserIcon className="text-muted-foreground size-4 shrink-0" />,
    };
  }

  if (columnSchema.data_type === "USER-DEFINED") {
    return {
      ...baseOptions,
      icon: (
        <ChevronDownIcon className="text-muted-foreground size-4 shrink-0" />
      ),
      type: "select",
    };
  }

  switch (format) {
    case "email":
      return {
        ...baseOptions,
        type: "email",
        icon: <MailIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "tel":
      return {
        ...baseOptions,
        type: "tel",
        icon: <PhoneIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "url":
      return {
        ...baseOptions,
        type: "url",
        icon: <LinkIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "rating":
      return {
        ...baseOptions,
        type: "rating",
        icon: <StarIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "percentage":
      return {
        ...baseOptions,
        type: "percentage",
        icon: <PercentIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "color":
      return {
        ...baseOptions,
        type: "color",
        icon: <PaletteIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "duration":
      return {
        ...baseOptions,
        type: "duration",
        icon: <TimerIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "uuid":
      return {
        ...baseOptions,
        type: "uuid",
        icon: <HashIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "character":
    case "varchar":
      return {
        ...baseOptions,
        type: "text",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">ab</code>
        ),
      };

    case "text":
      return {
        ...baseOptions,
        type: "longtext",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">AB</code>
        ),
      };

    case "bit":
    case "varbit":
      return {
        ...baseOptions,
        type: "number",
        icon: <BinaryIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "bytea":
      return {
        ...baseOptions,
        type: "number",
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
        type: "number",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">1.23</code>
        ),
      };

    case "int8":
    case "bigint":
    case "bigserial":
      return {
        ...baseOptions,
        type: "number",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">123</code>
        ),
      };

    case "int2":
    case "smallint":
    case "smallserial":
      return {
        ...baseOptions,
        type: "number",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">123</code>
        ),
      };

    case "int4":
    case "integer":
    case "serial":
      return {
        ...baseOptions,
        type: "number",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">123</code>
        ),
      };

    case "money":
      return {
        ...baseOptions,
        type: "money",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">$</code>
        ),
      };

    case "date":
      return {
        ...baseOptions,
        type: "date",
        icon: (
          <CalendarDaysIcon className="text-muted-foreground size-4 shrink-0" />
        ),
      };

    case "time":
    case "timetz":
      return {
        ...baseOptions,
        type: "time",
        icon: <ClockIcon className="text-muted-foreground size-4 shrink-0" />,
      };

    case "timestamptz":
    case "timestamp":
      return {
        ...baseOptions,
        type: "datetime",
        icon: (
          <CalendarClockIcon className="text-muted-foreground size-4 shrink-0" />
        ),
      };

    case "json":
    case "jsonb":
      return {
        ...baseOptions,
        type: "json",
        icon: (
          <code className="text-muted-foreground font-mono text-sm">{`{}`}</code>
        ),
      };

    case "bool":
      return {
        ...baseOptions,
        type: "boolean",
        icon: (
          <ToggleLeftIcon className="text-muted-foreground size-4 shrink-0" />
        ),
      };

    default:
      return {
        ...baseOptions,
        type: "text",
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
        variant: "boolean",
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
