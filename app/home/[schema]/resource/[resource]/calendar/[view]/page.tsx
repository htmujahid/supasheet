import { DefaultHeader } from "@/components/layouts/default-header";
import { ResourceCalendarView } from "@/features/resource/components/resource-calendar-view";
import { loadResourceCalendarViewData } from "@/features/resource/lib/loaders";
import { CalendarProvider } from "@/interfaces/calendar/components/calendar-context";
import { CalendarView } from "@/interfaces/calendar/lib/types";
import { DatabaseSchemas, DatabaseTables, DatabaseViews } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas>;
    view: DatabaseViews<DatabaseSchemas>;
  }>;
  searchParams: Promise<{ searchView?: CalendarView }>;
}) {
  const { schema, resource, view } = await params;
  const { searchView = "day" } = await searchParams;
  const events = await loadResourceCalendarViewData(schema, view);
  console.log("Events:", events);

  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[
          { title: formatTitle(resource), url: ".." },
          { title: formatTitle(view) },
        ]}
      />
      <div className="p-4">
        <CalendarProvider events={events}>
          <ResourceCalendarView view={searchView} />
        </CalendarProvider>
      </div>
    </div>
  )
}