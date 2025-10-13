import { notFound } from "next/navigation";

import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ResourceTable } from "@/features/resource/components/resource-table";
import {
  loadColumnsSchema,
  loadResourceData,
  loadResourcePermissions,
  loadTableSchema,
} from "@/features/resource/lib/loaders";
import { resourceSearchParamsCache } from "@/features/resource/lib/validations";
import { DatabaseSchemas, DatabaseTables } from "@/lib/database-meta.types";
import { withI18n } from "@/lib/i18n/with-i18n";

async function HomeResourcePage(props: {
  params: Promise<{
    schema: string;
    id: string;
  }>;
  searchParams: Promise<{
    page: string;
    perPage: string;
  }>;
}) {
  const { id, schema } = (await props.params) as {
    schema: DatabaseSchemas;
    id: DatabaseTables<typeof schema>;
  };
  const searchParams = await props.searchParams;
  const search = resourceSearchParamsCache.parse(searchParams);

  const [tableSchema, columnsSchema, data, permissions] = await Promise.all([
    loadTableSchema(schema, id),
    loadColumnsSchema(schema, id),
    loadResourceData(schema, id, search),
    loadResourcePermissions(schema, id),
  ]);

  if (!columnsSchema) {
    notFound();
  }

  if (!permissions.canSelect) {
    notFound();
  }

  return (
    <div className="px-4">
      <ResourceContextProvider permissions={permissions}>
        <ResourceTable
          tableSchema={tableSchema}
          columnsSchema={columnsSchema}
          data={data}
        />
      </ResourceContextProvider>
    </div>
  );
}

export default withI18n(HomeResourcePage);
