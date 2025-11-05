import { Metadata } from "next";

import { notFound } from "next/navigation";

import { SearchParams } from "nuqs";

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
  DatabaseViews,
  TableMetadata,
  ViewMetadata,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

type ResourceSheetPageProps = {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas> | DatabaseViews<DatabaseSchemas>;
    id: string;
  }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  params,
}: ResourceSheetPageProps): Promise<Metadata> {
  const { schema, resource } = await params;

  return {
    title: `${formatTitle(resource)} Sheet - ${schema}`,
  };
}

async function ResourceSheetPage({
  params,
  searchParams,
}: ResourceSheetPageProps) {
  const { resource, schema, id } = await params;

  const { page = "1", perPage = "1000", ...rest } = await searchParams;
  const search = resourceSearchParamsCache.parse({ page, perPage, ...rest });

  const tableSchema = await loadTableSchema(schema, resource);
  const viewSchema = await loadViewSchema(schema, resource);

  const meta = tableSchema
    ? ((tableSchema?.comment
        ? JSON.parse(tableSchema.comment)
        : {}) as TableMetadata)
    : ((viewSchema?.comment
        ? JSON.parse(viewSchema.comment)
        : {}) as ViewMetadata);

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

export default ResourceSheetPage;
