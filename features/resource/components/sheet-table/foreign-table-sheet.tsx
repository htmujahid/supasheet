import { useCallback, useMemo, useState } from "react";

import {
  ColumnFiltersState,
  SortingState,
  Updater,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DataTable } from "@/interfaces/data-table/components/data-table";
import { DataTableAdvancedToolbar } from "@/interfaces/data-table/components/data-table-advanced-toolbar";
import { DataTableClientFilterList } from "@/interfaces/data-table/components/data-table-client-filter-list";
import { DataTableSortList } from "@/interfaces/data-table/components/data-table-sort-list";
import {
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from "@/interfaces/data-table/types/data-table";
import type {
  Relationship,
  ResourceDataSchema,
} from "@/lib/database-meta.types";

import { useColumnsSchema, useResourceData } from "../../lib/data";
import { CreateLazyResourceSheet } from "../create-lazy-resource-sheet";
import { getSheetTableColumns } from "./sheet-table-columns";

type ForeignTableSheetProps = React.ComponentPropsWithRef<typeof Sheet> & {
  relationship: Relationship;
  setRecord: (record: ResourceDataSchema) => void;
};

export function ForeignTableSheet({
  relationship,
  setRecord,
  ...props
}: ForeignTableSheetProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 100, //default page size
  });

  const [filters, setFilters] = useState<ExtendedColumnFilter<unknown>[]>([]);
  const [sort, setSort] = useState<ExtendedColumnSort<unknown>[]>([]);

  const { data, refetch } = useResourceData(
    relationship.target_table_schema,
    relationship.target_table_name,
    {
      page: pagination.pageIndex + 1,
      perPage: pagination.pageSize,
      sort,
      filters,
      joinOperator: "and" as const,
    },
  );

  const { data: columnsSchema } = useColumnsSchema(
    relationship.target_table_schema,
    relationship.target_table_name,
  );

  const columns = useMemo(
    () =>
      getSheetTableColumns({
        columnsSchema: columnsSchema ?? [],
        setRecord,
      }),
    [columnsSchema, setRecord],
  );

  const table = useReactTable({
    data: data?.results ?? [],
    columns,
    state: {
      pagination,
      sorting: sort,
      columnFilters: filters,
    },
    onSortingChange: useCallback(
      (updaterOrValue: Updater<SortingState>) => {
        if (typeof updaterOrValue === "function") {
          const newSorting = updaterOrValue(sort);
          setSort(newSorting as ExtendedColumnSort<unknown>[]);
        } else {
          setSort(updaterOrValue as ExtendedColumnSort<unknown>[]);
        }
        // Refetch data when sort changes
        refetch();
      },
      [sort, setSort, refetch],
    ),
    onColumnFiltersChange: useCallback(
      (updaterOrValue: Updater<ColumnFiltersState>) => {
        if (typeof updaterOrValue === "function") {
          const newFilters = updaterOrValue(filters);
          setFilters(newFilters as ExtendedColumnFilter<unknown>[]);
        } else {
          setFilters(updaterOrValue as ExtendedColumnFilter<unknown>[]);
        }
        // Refetch data when filters change
        refetch();
      },
      [filters, setFilters, refetch],
    ),
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: data?.total ?? 0,
  });

  return (
    <Sheet {...props}>
      <SheetContent className="flex h-full w-full flex-col overflow-hidden sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            Select to reference from {relationship.target_table_name}
          </SheetTitle>
          <SheetDescription>
            Select a record from the table to create a reference.
          </SheetDescription>
        </SheetHeader>
        <div className="data-table-container px-4">
          {/* select 2nd child using tailwind */}
          <DataTable
            table={table}
            className="[&>div:nth-child(2)]:h-[calc(100svh-194px)]"
          >
            <DataTableAdvancedToolbar table={table}>
              <DataTableClientFilterList table={table} />
              <DataTableSortList table={table} />
              <CreateLazyResourceSheet
                schema={relationship.target_table_schema}
                resource={relationship.target_table_name}
                showTrigger
              />
            </DataTableAdvancedToolbar>
          </DataTable>
        </div>
      </SheetContent>
    </Sheet>
  );
}
