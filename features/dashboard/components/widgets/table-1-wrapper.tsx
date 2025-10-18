import { loadWidget } from "../../lib/loaders";
import { DashboardWidgetsSchema } from "../../lib/types";
import { Table1Widget } from "./table-1";

export async function Table1Wrapper({
  widget,
}: {
  widget: DashboardWidgetsSchema;
}) {
  const data = (
    await loadWidget(widget.schema, widget.view_name)
  ) as any[] | null;

  return <Table1Widget widget={widget} data={data} />;
}
