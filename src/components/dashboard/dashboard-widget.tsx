import type { DatabaseSchemas } from "#/lib/database-meta.types"
import type { DashboardWidgetSchema } from "#/lib/supabase/data/dashboard"

import { Card1 } from "./card-1"
import { Card2 } from "./card-2"
import { Card3 } from "./card-3"
import { Card4 } from "./card-4"
import { Table1Widget } from "./table-1"
import { Table2Widget } from "./table-2"

export function DashboardWidget<S extends DatabaseSchemas>({
  widget,
}: {
  widget: DashboardWidgetSchema<S>
}) {
  switch (widget.widget_type) {
    case "card_1":
      return <Card1 widget={widget} />
    case "card_2":
      return <Card2 widget={widget} />
    case "card_3":
      return <Card3 widget={widget} />
    case "card_4":
      return <Card4 widget={widget} />
    case "table_1":
      return <Table1Widget widget={widget} />
    case "table_2":
      return <Table2Widget widget={widget} />
    default:
      return null
  }
}
