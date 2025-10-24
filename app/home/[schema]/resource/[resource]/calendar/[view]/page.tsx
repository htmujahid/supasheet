import { DefaultHeader } from "@/components/layouts/default-header";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ResourceCalendarView } from "@/features/resource/components/resource-calendar-view";
import { loadResourceCalendarViewData } from "@/features/resource/lib/loaders";
import { CalendarProvider } from "@/interfaces/calendar/components/calendar-context";
import { CalendarView } from "@/interfaces/calendar/lib/types";
import { DatabaseSchemas, DatabaseTables, DatabaseViews } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { CalendarRangeIcon, ColumnsIcon, Grid2x2Icon, Grid3x3Icon, ListIcon } from "lucide-react";
import Link from "next/link";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas>;
    view: DatabaseViews<DatabaseSchemas>;
  }>;
  searchParams: Promise<{ layout?: CalendarView }>;
}) {
  const { schema, resource, view } = await params;
  const { layout = "day" } = await searchParams;
  const events = await loadResourceCalendarViewData(schema, view);

  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[
          { title: formatTitle(resource), url: ".." },
          { title: formatTitle(view) },
        ]}
      >
        <ButtonGroup>
          <Button asChild aria-label="View by day" size="icon-sm" variant={layout === "day" ? "default" : "outline"} className="rounded-r-none [&_svg]:size-5">
            <Link href="?layout=day">
              <ListIcon strokeWidth={1.8} />
            </Link>
          </Button>

          <Button
            asChild
            aria-label="View by week"
            size="icon-sm"
            variant={layout === "week" ? "default" : "outline"}
            className="-ml-px rounded-none [&_svg]:size-5"
          >
            <Link href="?layout=week">
              <ColumnsIcon strokeWidth={1.8} />
            </Link>
          </Button>

          <Button
            asChild
            aria-label="View by month"
            size="icon-sm"
            variant={layout === "month" ? "default" : "outline"}
            className="-ml-px rounded-none [&_svg]:size-5"
          >
            <Link href="?layout=month">
              <Grid2x2Icon strokeWidth={1.8} />
            </Link>
          </Button>

          <Button
            asChild
            aria-label="View by year"
            size="icon-sm"
            variant={layout === "year" ? "default" : "outline"}
            className="-ml-px rounded-none [&_svg]:size-5"
          >
            <Link href="?layout=year">
              <Grid3x3Icon strokeWidth={1.8} />
            </Link>
          </Button>

          <Button
            asChild
            aria-label="View by agenda"
            size="icon-sm"
            variant={layout === "agenda" ? "default" : "outline"}
            className="-ml-px rounded-l-none [&_svg]:size-5"
          >
            <Link href="?layout=agenda">
              <CalendarRangeIcon strokeWidth={1.8} />
            </Link>
          </Button>
        </ButtonGroup>
      </DefaultHeader>
      <div className="p-4">
        <CalendarProvider events={events}>
          <ResourceCalendarView view={layout} />
        </CalendarProvider>
      </div>
    </div>
  )
}