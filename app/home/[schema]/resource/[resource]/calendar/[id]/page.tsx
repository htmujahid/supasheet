import { cache } from "react";

import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { If } from "@/components/makerkit/if";
import { TCalendarView, TEventColor } from "@/components/ui/event-calendar";
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
import { resourceSearchParamsCache } from "@/features/resource/lib/validations";
import {
  DatabaseSchemas,
  DatabaseTables,
  TableMetadata,
  ViewMetadata,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { withI18n } from "@/lib/i18n/with-i18n";

const colorMap = new Map<string, string>();
let colorIndex = 0;
const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "teal",
  "pink",
  "cyan",
  "lime",
];

const stringToColor = cache((str: string) => {
  if (colorMap.has(str)) {
    return colorMap.get(str)! as TEventColor;
  }

  const color = colors[colorIndex % colors.length];
  colorMap.set(str, color);
  colorIndex += 1;
  return color as TEventColor;
});

async function Page(props: {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas>;
    id: string;
  }>;
  searchParams: Promise<{
    page: string;
    perPage: string;
    view: TCalendarView;
  }>;
}) {
  const { resource, schema, id } = await props.params;

  const {
    page = "1",
    perPage = "1000",
    view = "day",
    ...rest
  } = await props.searchParams;
  const search = resourceSearchParamsCache.parse({ page, perPage, ...rest });

  const tableSchema = await loadTableSchema(schema, resource);
  const viewSchema = await loadViewSchema(schema, resource);

  const meta = tableSchema ? (
    tableSchema?.comment ? JSON.parse(tableSchema.comment) : {}
  ) as TableMetadata : (
    viewSchema?.comment ? JSON.parse(viewSchema.comment) : {}
  ) as ViewMetadata;


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
    loadResourceData(schema, resource, search),
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
      title: item[titleFieldName] as string,
      color: stringToColor(item[badgeFieldName] as string),
      startDate: item[startDateFieldName] as string,
      endDate: item[endDateFieldName] ?? (item[startDateFieldName] as string),
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

export default withI18n(Page);
