import type { RowData } from "@tanstack/react-table"

import type { DataTableConfig } from "#/config/data-table"

import type { ColumnFieldMetadata } from "./fields"

export type FilterVariant = DataTableConfig["filterVariants"][number]
export type FilterOperator = DataTableConfig["operators"][number]

export type ColumnMeta = {
  label: string
  variant: FilterVariant
  icon?: React.ElementType
  placeholder?: string
  options?: { label: string; value: string; icon?: React.ElementType }[]
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line no-shadow
  interface ColumnMeta<
    TData extends RowData,
    TValue,
  > extends ColumnFieldMetadata {}

   
  interface TableMeta<TData extends RowData> {
    filename?: string
  }
}
