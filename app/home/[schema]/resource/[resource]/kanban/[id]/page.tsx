import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { ResourceKanbanView } from "@/features/resource/components/resource-kanban";
import {
  loadColumnsSchema,
  loadResourceData,
  loadResourcePermissions,
  loadTableSchema,
} from "@/features/resource/lib/loaders";
import {
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
  TableMetadata,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { resourceSearchParamsCache } from "@/features/resource/lib/validations";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { KanbanViewReducedData } from "@/features/resource/lib/types";

export default async function Page(props: {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas>;
    id: string;
  }>;
  searchParams: Promise<{
    layout: "list" | "board";
    page: string;
    perPage: string;
  }>;
}) {
  const { resource, schema, id } = await props.params;

  const { page = '1', perPage = "1000", layout = "board", ...rest } = await props.searchParams;
  const search = resourceSearchParamsCache.parse({ page, perPage, ...rest });

  const tableSchema = await loadTableSchema(schema, resource);

  if (!tableSchema) {
    notFound();
  }

  const meta = (tableSchema?.comment ? JSON.parse(tableSchema.comment) : {}) as TableMetadata;

  const currentView = meta.items?.find((item) => item.id === id);

  if (!currentView) {
    notFound();
  }

  const [columnsSchema, data] = await Promise.all([
    loadColumnsSchema(schema, resource),
    loadResourceData(schema, resource, search),
  ]);

  const groupFieldName = currentView.group as string;
  const titleFieldName = currentView.title as string;
  const descriptionFieldName = currentView.description as string;
  const badgeFieldName = currentView.badge as string;
  const dateFieldName = currentView.date as string;

  const primaryKeys = tableSchema?.primary_keys as PrimaryKey[];

  if (
    !groupFieldName ||
    !titleFieldName ||
    !dateFieldName ||
    !columnsSchema?.length
  ) {
    notFound();
  }

  const groupedData = data.results.reduce((acc, item) => {
    const groupKey = item[groupFieldName] as string;
    
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }

    acc[groupKey].push({
      title: item[titleFieldName] as string,
      description: item[descriptionFieldName] as string,
      date: item[dateFieldName] as string,
      badge: item[badgeFieldName] as string,
      data: item,
    });

    return acc;
  }, {} as KanbanViewReducedData);

  const permissions = await loadResourcePermissions(schema, resource);

  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[
          { title: formatTitle(resource), url: ".." },
          { title: formatTitle(id) },
        ]}
      />
      <div className="px-4 py-2">
        <ResourceContextProvider permissions={permissions}>
          <ResourceKanbanView
            data={groupedData}
            tableSchema={tableSchema}
            columnsSchema={columnsSchema}
            groupBy={groupFieldName}
            layout={layout}
          />
        </ResourceContextProvider>
      </div>
    </div>
  );
}