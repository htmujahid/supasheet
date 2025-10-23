import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { ResourceKanbanView } from "@/features/resource/components/resource-kanban-view";
import {
  loadColumnsSchema,
  loadKanbanViewData,
} from "@/features/resource/lib/loaders";
import {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
} from "@/lib/database-meta.types";
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

  const columnSchema = await loadColumnsSchema(schema, view);

  const groupBy = columnSchema?.[0]?.name as string;

  if (!groupBy) {
    notFound();
  }

  const kanbanViewData = await loadKanbanViewData(schema, view, groupBy);

  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[
          { title: formatTitle(resource), url: ".." },
          { title: formatTitle(view) },
        ]}
      />
      <div className="p-4">
        <ResourceKanbanView
          data={kanbanViewData}
          schema={schema}
          resource={resource}
          groupBy={groupBy}
        />
      </div>
    </div>
  );
}
