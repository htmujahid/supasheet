import { DashboardWidgetsSchema } from "../lib/types";
import { Card1 } from "./widgets/card-1";
import { Card2 } from "./widgets/card-2";
import { Card3 } from "./widgets/card-3";
import { Card4 } from "./widgets/card-4";
import { Table1Wrapper } from "./widgets/table-1-wrapper";
import { Table2Wrapper } from "./widgets/table-2-wrapper";

export function DashboardWidgets({
  widget,
}: {
  widget: DashboardWidgetsSchema;
}) {
  switch (widget.widget_type) {
    case "card_1":
      return <Card1 widget={widget} />;
    case "card_2":
      return <Card2 widget={widget} />;
    case "card_3":
      return <Card3 widget={widget} />;
    case "card_4":
      return <Card4 widget={widget} />;
    case "table_1":
      return <Table1Wrapper widget={widget} />;
    case "table_2":
      return <Table2Wrapper widget={widget} />;
    // Add more cases for different widget types as needed
    default:
      return <div>Unknown widget type: {widget.widget_type}</div>;
  }
}
