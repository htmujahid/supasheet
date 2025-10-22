import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ResourceTable } from "@/features/resource/components/resource-table";
import {
  loadColumnsSchema,
  loadResourceData,
  loadResourcePermissions,
  loadSelectPermissions,
  loadTableSchema,
} from "@/features/resource/lib/loaders";
import { resourceSearchParamsCache } from "@/features/resource/lib/validations";
import { DatabaseSchemas, DatabaseTables } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { withI18n } from "@/lib/i18n/with-i18n";

async function HomeResourcePage(props: {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas>;
  }>;
  searchParams: Promise<{
    page: string;
    perPage: string;
  }>;
}) {
  const { resource, schema } = await props.params;

  const searchParams = await props.searchParams;
  const search = resourceSearchParamsCache.parse(searchParams);

  const [tableSchema, columnsSchema, permissions] = await Promise.all([
    loadTableSchema(schema, resource),
    loadColumnsSchema(schema, resource),
    loadResourcePermissions(schema, resource),
  ]);

  const proxy = JSON.parse(tableSchema?.comment ?? "{}").proxy as {
    schema: never;
    view: never;
  };

  const [proxyColumnsSchema, data, proxyPermissions] = await Promise.all([
    proxy ? loadColumnsSchema(proxy.schema, proxy.view) : columnsSchema,
    loadResourceData(proxy.schema ?? schema, proxy.view ?? resource, search),
    loadSelectPermissions(proxy.schema ?? schema, proxy.view ?? resource),
  ]);

  if (!permissions.canSelect && !proxyPermissions) {
    notFound();
  }

  if (!columnsSchema?.length) {
    notFound();
  }

  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: formatTitle(resource) }]} />
      <div className="px-4">
        <ResourceContextProvider permissions={permissions}>
          <ResourceTable
            tableSchema={tableSchema}
            columnsSchema={columnsSchema}
            proxyColumnsSchema={proxyColumnsSchema}
            data={data}
          />
        </ResourceContextProvider>
      </div>
    </div>
  );
}

export default withI18n(HomeResourcePage);
