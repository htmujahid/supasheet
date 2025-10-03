import { DatabaseTables } from "@/lib/database-meta.types";

import { loadWidget } from "../../loaders";
import { DashboardWidgetsSchema } from "../../types";
import { Table1Widget } from "./table-1";

export async function Table1Wrapper({
  widget,
}: {
  widget: DashboardWidgetsSchema;
}) {
  const data = (await loadWidget(
    widget.view_name as DatabaseTables<"dashboards">,
  )) as any[] | null;

  return <Table1Widget widget={widget} data={data} />;
}
