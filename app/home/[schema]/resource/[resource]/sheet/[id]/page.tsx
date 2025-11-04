import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { If } from "@/components/makerkit/if";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ResourceGrid } from "@/features/resource/components/resource-gird";
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

async function HomeResourcePage(props: {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas>;
    id: string;
  }>;
  searchParams: Promise<{
    page: string;
    perPage: string;
  }>;
}) {
  const { resource, schema, id } = await props.params;

  const { page = "1", perPage = "1000", ...rest } = await props.searchParams;
  const search = resourceSearchParamsCache.parse({ page, perPage, ...rest });

  const tableSchema = await loadTableSchema(schema, resource);
  const viewSchema = await loadViewSchema(schema, resource);

  const meta = tableSchema ? (
    tableSchema?.comment ? JSON.parse(tableSchema.comment) : {}
  ) as TableMetadata : (
    viewSchema?.comment ? JSON.parse(viewSchema.comment) : {}
  ) as ViewMetadata;

  const currentView = meta.items?.find(
    (item) => item.id === id && item.type === "sheet",
  );

  if (!currentView) {
    notFound();
  }

  const [columnsSchema, data, permissions] = await Promise.all([
    loadColumnsSchema(schema, resource),
    loadResourceData(schema, resource, search),
    loadResourcePermissions(schema, resource),
  ]);

  if (!columnsSchema?.length) {
    notFound();
  }

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
          <ResourceGrid
            tableSchema={tableSchema}
            columnsSchema={columnsSchema}
            data={data}
          />
        </ResourceContextProvider>
      </div>
    </div>
  );
}

export default withI18n(HomeResourcePage);
