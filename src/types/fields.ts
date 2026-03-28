import type { ReactElement } from "react"

import type { ColumnSchema } from "#/lib/database-meta.types"

import type { FilterVariant } from "./data-table"

export type ColumnMetadata = {
  label: string
  variant:
    | "uuid"
    | "text"
    | "long_text"
    | "number"
    | "date"
    | "datetime"
    | "boolean"
    | "json"
    | "select"
    | "time"
    | "money"
    | "file"
    | "avatar"
    | "rich_text"
    | "email"
    | "tel"
    | "url"
    | "rating"
    | "percentage"
    | "color"
    | "duration"
    | "array"
  filterVariant: FilterVariant
  icon: ReactElement | null
  defaultValue: string | null
  required: boolean
  disabled: boolean
  isArray: boolean
  isMetadata: boolean
  isPrimaryKey: boolean
  // relationship: Relationship | undefined
  comment: string | null
  // primaryKeys: PrimaryKey[]
  table: string
  schema: string
  options?: {
    label: string
    value: string
  }[]
}

export type FieldProps = {
  columnMetadata: ColumnMetadata
  disabled?: boolean
}

export type FileObject = {
  name: string
  type: string
  size: number
  url: string
  last_modified: string
}

export type FileFieldProps = {
  columnMetadata: ColumnMetadata
  columnSchema: ColumnSchema
}

export type UploadProgress = {
  fileId: string
  progress: number
  completed: boolean
  error?: string
}

export type FileFieldConfig = {
  maxSize?: number
  maxFiles?: number
  accept?: string
}
