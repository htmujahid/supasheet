import { DataTableSkeleton } from "@/interfaces/data-table/components/data-table-skeleton";

export default function ReportLoading() {
  return (
    <DataTableSkeleton
      columnCount={7}
      rowCount={100}
      filterCount={2}
      cellWidths={[
        "64px",
        "170px",
        "170px",
        "170px",
        "170px",
        "170px",
        "170px",
        "170px",
        "170px",
        "170px",
        "170px",
        "170px",
      ]}
      shrinkZero
    />
  );
}
