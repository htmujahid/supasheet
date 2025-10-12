import { DataTableSkeleton } from "@/interfaces/data-table/components/data-table-skeleton";

export default function AuditLogLoading() {
  return (
    <DataTableSkeleton
      columnCount={10}
      rowCount={50}
      filterCount={3}
      cellWidths={[
        "40px",
        "120px",
        "100px",
        "100px",
        "120px",
        "150px",
        "100px",
        "80px",
        "120px",
        "80px",
        "40px",
      ]}
      shrinkZero
    />
  );
}
