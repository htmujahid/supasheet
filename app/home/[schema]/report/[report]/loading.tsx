import { DefaultHeader } from "@/components/layouts/default-header";
import { DataTableSkeleton } from "@/interfaces/data-table/components/data-table-skeleton";

export default function ReportLoading() {
  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[{ title: "Report", url: "." }, { title: "..." }]}
      />
      <div className="px-4">
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
          ]}
          shrinkZero
        />
      </div>
    </div>
  );
}
