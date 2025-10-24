import { DefaultHeader } from "@/components/layouts/default-header";
import { ResourceGanttView } from "@/features/resource/components/resource-gannt-view";
import { loadResourceGanttViewData } from "@/features/resource/lib/loaders";
import { DatabaseSchemas, DatabaseTables, DatabaseViews } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

export default async function Page({
  params,
}: {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas>;
    view: DatabaseViews<DatabaseSchemas>;
  }>;
}) {
  const { schema, resource, view } = await params;
  const features = await loadResourceGanttViewData(schema, view);

  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[
          { title: formatTitle(resource), url: ".." },
          { title: formatTitle(view) },
        ]}
      />
      <div className="p-4">
        <ResourceGanttView features={features} />
      </div>
    </div>
  )
}