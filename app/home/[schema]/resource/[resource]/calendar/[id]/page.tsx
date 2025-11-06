import { Metadata } from "next";

import { notFound } from "next/navigation";

import { get } from "lodash";
import { SearchParams } from "nuqs";

import { DefaultHeader } from "@/components/layouts/default-header";
import { If } from "@/components/makerkit/if";
import { TCalendarView } from "@/components/ui/event-calendar";
import { ResourceCalendarView } from "@/features/resource/components/resource-calendar";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ResourceSheet } from "@/features/resource/components/resource-sheet";
import {
  loadColumnsSchema,
  loadResourceData,
  loadResourcePermissions,
  loadTableSchema,
  loadViewSchema,
} from "@/features/resource/lib/loaders";
import { stringToColor } from "@/features/resource/lib/utils/colors";
import { resourceSearchParamsCache } from "@/features/resource/lib/validations";
import {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  TableMetadata,
  ViewMetadata,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

type ResourceCalendarPageProps = {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas> | DatabaseViews<DatabaseSchemas>;
    id: string;
  }>;
  searchParams: Promise<SearchParams & { view?: TCalendarView }>;
};

export async function generateMetadata({
  params,
}: ResourceCalendarPageProps): Promise<Metadata> {
  const { schema, resource } = await params;

  return {
    title: `${formatTitle(resource)} Calendar - ${schema}`,
  };
}

async function ResourceCalendarPage({
  params,
  searchParams,
}: ResourceCalendarPageProps) {
  const { resource, schema, id } = await params;

  const {
    page = "1",
    perPage = "1000",
    view = "day",
    ...rest
  } = await searchParams;
  const search = resourceSearchParamsCache.parse({ page, perPage, ...rest });

  const tableSchema = await loadTableSchema(schema, resource);
  const viewSchema = await loadViewSchema(schema, resource);

  const tableMeta = JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata;
  const viewMeta = JSON.parse(viewSchema?.comment ?? "{}") as ViewMetadata;

  const meta = tableSchema ? tableMeta : viewMeta;

  const currentView = meta.items?.find(
    (item) => item.id === id && item.type === "calendar",
  );

  if (!currentView) {
    notFound();
  }

  const titleFieldName = currentView.title as string;
  const startDateFieldName = currentView.startDate as string;
  const endDateFieldName = currentView.endDate as string;
  const badgeFieldName = currentView.badge as string;

  const [columnsSchema, data, permissions] = await Promise.all([
    loadColumnsSchema(schema, resource),
    loadResourceData(schema, resource, search, tableMeta.query),
    loadResourcePermissions(schema, resource),
  ]);

  if (
    !titleFieldName ||
    !startDateFieldName ||
    !endDateFieldName ||
    !columnsSchema?.length
  ) {
    notFound();
  }

  const results = data?.results || [];

  const arrangedData = results.map((item, index) => {
    return {
      id: index.toString(),
      title: get(item, titleFieldName) as string,
      color: stringToColor(get(item, badgeFieldName) as string),
      startDate: get(item, startDateFieldName) as string,
      endDate:
        get(item, endDateFieldName) ??
        (get(item, startDateFieldName) as string),
      data: item,
    };
  });

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
      <div className="px-4">
        <ResourceContextProvider
          permissions={permissions}
          tableSchema={tableSchema}
          columnsSchema={columnsSchema}
        >
          <ResourceCalendarView
            view={view}
            data={arrangedData}
            tableSchema={tableSchema}
            columnsSchema={columnsSchema}
            currentView={currentView}
          />
        </ResourceContextProvider>
      </div>
    </div>
  );
}

export default ResourceCalendarPage;
