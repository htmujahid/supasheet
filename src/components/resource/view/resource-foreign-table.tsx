"use client"

import { useMemo } from "react"

import { getCoreRowModel, useReactTable } from "@tanstack/react-table"

import type {
  ColumnSchema,
  ResourceDataSchema,
  ResourceSchema,
} from "@/lib/database-meta.types"

import { DataTable } from "#/components/data-table/data-table"

import { getResourceForeignTableColumns } from "./resource-foriegn-table-columns"

type ResourceForeignTableProps = {
  relationship: ResourceSchema & { columns: ColumnSchema[] }
  data: ResourceDataSchema[] | null
}

export function ResourceForeignTable({
  relationship,
  data,
}: ResourceForeignTableProps) {
  const columns = useMemo(
    () =>
      getResourceForeignTableColumns({
        data: data ?? [],
        columnsSchema: relationship.columns ?? [],
        resourceSchema: relationship,
      }),
    [relationship, data]
  )

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: data?.length ?? 0,
  })

  return <DataTable table={table} />
}
