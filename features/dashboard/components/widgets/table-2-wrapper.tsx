import { DatabaseTables } from "@/lib/database-meta.types";

import { loadWidget } from "../../loaders";
import { DashboardWidgetsSchema } from "../../types";
import { Table2Widget } from "./table-2";

export async function Table2Wrapper({
  widget,
}: {
  widget: DashboardWidgetsSchema;
}) {
  const data = (await loadWidget(
    widget.view_name as DatabaseTables<"dashboards">,
  )) as any[] | null;

  return <Table2Widget widget={widget} data={data} />;
}
