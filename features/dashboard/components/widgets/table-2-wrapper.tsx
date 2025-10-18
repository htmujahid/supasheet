import { loadWidget } from "../../lib/loaders";
import { DashboardWidgetsSchema } from "../../lib/types";
import { Table2Widget } from "./table-2";

export async function Table2Wrapper({
  widget,
}: {
  widget: DashboardWidgetsSchema;
}) {
  const data = (
    await loadWidget(widget.schema, widget.view_name)
  ) as any[] | null;

  return <Table2Widget widget={widget} data={data} />;
}
