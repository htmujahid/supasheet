import { Metadata } from "next";

import { notFound } from "next/navigation";

import { SearchParams } from "nuqs";

import { DefaultHeader } from "@/components/layouts/default-header";
import { If } from "@/components/makerkit/if";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ResourceSheet } from "@/features/resource/components/resource-sheet";
import { ResourceTable } from "@/features/resource/components/resource-table";
import {
  loadColumnsSchema,
  loadResourceData,
  loadResourcePermissions,
  loadTableSchema,
} from "@/features/resource/lib/loaders";
import { resourceSearchParamsCache } from "@/features/resource/lib/validations";
import {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  TableMetadata,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

type ResourcePageProps = {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas> | DatabaseViews<DatabaseSchemas>;
  }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { schema, resource } = await params;

  return {
    title: `${formatTitle(resource)} - ${formatTitle(schema)}`,
  };
}

async function ResourcePage({ params, searchParams }: ResourcePageProps) {
  const { schema, resource } = await params;

  const search = resourceSearchParamsCache.parse(await searchParams);

  const tableSchema = await loadTableSchema(schema, resource);

  const metaData = JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata;

  const [columnsSchema, data, permissions] = await Promise.all([
    loadColumnsSchema(schema, resource),
    loadResourceData(schema, resource, search, metaData.query),
    loadResourcePermissions(schema, resource),
  ]);

  if (!columnsSchema?.length) {
    notFound();
  }

  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: formatTitle(resource) }]}>
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
          <ResourceTable
            tableSchema={tableSchema}
            columnsSchema={columnsSchema}
            data={data}
          />
        </ResourceContextProvider>
      </div>
    </div>
  );
}

export default ResourcePage;
