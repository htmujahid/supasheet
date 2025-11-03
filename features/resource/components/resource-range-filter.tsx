"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import type { ExtendedColumnFilter } from "@/interfaces/data-table/types/data-table";
import { cn } from "@/lib/utils";

import { ColumnFilterData } from "./fields/types";

interface ResourceRangeFilterProps<TData> extends React.ComponentProps<"div"> {
  filter: ExtendedColumnFilter<TData>;
  column: ColumnFilterData;
  inputId: string;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>,
  ) => void;
}

export function ResourceRangeFilter<TData>({
  filter,
  column,
  inputId,
  onFilterUpdate,
  className,
  ...props
}: ResourceRangeFilterProps<TData>) {
  const formatValue = React.useCallback(
    (value: string | number | undefined) => {
      if (value === undefined || value === "") return "";
      const numValue = Number(value);
      return Number.isNaN(numValue)
        ? ""
        : numValue.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          });
    },
    [],
  );

  const value = React.useMemo(() => {
    if (Array.isArray(filter.value)) return filter.value.map(formatValue);
    return [formatValue(filter.value), ""];
  }, [filter.value, formatValue]);

  const onRangeValueChange = React.useCallback(
    (value: string, isMin?: boolean) => {
      const numValue = Number(value);
      const currentValues = Array.isArray(filter.value)
        ? filter.value
        : ["", ""];
      const otherValue = isMin
        ? (currentValues[1] ?? "")
        : (currentValues[0] ?? "");

      if (value === "" || !Number.isNaN(numValue)) {
        onFilterUpdate(filter.filterId, {
          value: isMin ? [value, otherValue] : [otherValue, value],
        });
      }
    },
    [filter.filterId, filter.value, onFilterUpdate],
  );

  return (
    <div
      data-slot="range"
      className={cn("flex w-full items-center gap-2", className)}
      {...props}
    >
      <Input
        id={`${inputId}-min`}
        type="number"
        aria-label={`${column.label} minimum value`}
        data-slot="range-min"
        inputMode="numeric"
        className="h-8 w-full rounded"
        defaultValue={value[0]}
        onChange={(event) => onRangeValueChange(event.target.value, true)}
      />
      <span className="text-muted-foreground sr-only shrink-0">to</span>
      <Input
        id={`${inputId}-max`}
        type="number"
        aria-label={`${column.label} maximum value`}
        data-slot="range-max"
        inputMode="numeric"
        className="h-8 w-full rounded"
        defaultValue={value[1]}
        onChange={(event) => onRangeValueChange(event.target.value)}
      />
    </div>
  );
}
