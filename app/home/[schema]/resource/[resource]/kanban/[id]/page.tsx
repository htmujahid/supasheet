import { Metadata } from "next";

import { notFound } from "next/navigation";

import { get } from "lodash";
import { SearchParams } from "nuqs";

import { DefaultHeader } from "@/components/layouts/default-header";
import { If } from "@/components/makerkit/if";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ResourceKanbanView } from "@/features/resource/components/resource-kanban";
import { ResourceSheet } from "@/features/resource/components/resource-sheet";
import {
  loadColumnsSchema,
  loadResourceData,
  loadResourcePermissions,
  loadTableSchema,
  loadViewSchema,
} from "@/features/resource/lib/loaders";
import { KanbanViewReducedData } from "@/features/resource/lib/types";
import { resourceSearchParamsCache } from "@/features/resource/lib/validations";
import {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  TableMetadata,
  ViewMetadata,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

type ResourceKanbanPageProps = {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas> | DatabaseViews<DatabaseSchemas>;
    id: string;
  }>;
  searchParams: Promise<
    SearchParams & {
      layout?: "list" | "board";
    }
  >;
};

export async function generateMetadata({
  params,
}: ResourceKanbanPageProps): Promise<Metadata> {
  const { schema, resource } = await params;

  return {
    title: `${formatTitle(resource)} Kanban - ${formatTitle(schema)}`,
  };
}

async function ResourceKanbanPage({
  params,
  searchParams,
}: ResourceKanbanPageProps) {
  const { resource, schema, id } = await params;

  const {
    page = "1",
    perPage = "1000",
    layout = "board",
    ...rest
  } = await searchParams;

  const search = resourceSearchParamsCache.parse({ page, perPage, ...rest });

  const tableSchema = await loadTableSchema(schema, resource);
  const viewSchema = await loadViewSchema(schema, resource);

  const tableMeta = JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata;
  const viewMeta = JSON.parse(viewSchema?.comment ?? "{}") as ViewMetadata;

  const meta = tableSchema ? tableMeta : viewMeta;

  const currentView = meta.items?.find(
    (item) => item.id === id && item.type === "kanban",
  );

  if (!currentView) {
    notFound();
  }

  const [columnsSchema, data] = await Promise.all([
    loadColumnsSchema(schema, resource),
    loadResourceData(schema, resource, search, tableMeta.query),
  ]);

  const groupFieldName = currentView.group as string;
  const titleFieldName = currentView.title as string;
  const descriptionFieldName = currentView.description as string;
  const badgeFieldName = currentView.badge as string;
  const dateFieldName = currentView.date as string;

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
      title: get(item, titleFieldName) as string,
      description: get(item, descriptionFieldName) as string,
      date: get(item, dateFieldName) as string,
      badge: get(item, badgeFieldName) as string,
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
      >
        <If condition={permissions.canInsert}>
          <ResourceSheet
            tableSchema={tableSchema}
            columnsSchema={columnsSchema}
            data={null}
            create={true}
            showTrigger={true}
          />
        </If>
      </DefaultHeader>
      <div className="px-4 py-2">
        <ResourceContextProvider
          permissions={permissions}
          tableSchema={tableSchema}
          columnsSchema={columnsSchema}
        >
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

export default ResourceKanbanPage;
