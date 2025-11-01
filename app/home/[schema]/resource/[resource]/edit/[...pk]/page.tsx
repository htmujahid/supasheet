import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ResourceEditForm } from "@/features/resource/components/resource-edit-form";
import {
  loadColumnsSchema,
  loadResourcePermissions,
  loadSingleResourceData,
  loadTableSchema,
} from "@/features/resource/lib/loaders";
import {
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { withI18n } from "@/lib/i18n/with-i18n";

async function EditPage({
  params,
}: {
  params: Promise<{
    schema: string;
    resource: string;
    pk: string[];
  }>;
}) {
  const { resource, pk, schema } = (await params) as {
    schema: DatabaseSchemas;
    resource: DatabaseTables<typeof schema>;
    pk: string[];
  };

  const [tableSchema, columnsSchema, permissions] = await Promise.all([
    loadTableSchema(schema, resource),
    loadColumnsSchema(schema, resource),
    loadResourcePermissions(schema, resource),
  ]);

  if (!tableSchema) return notFound();
  if (!columnsSchema?.length) return notFound();
  if (!permissions.canUpdate) return notFound();

  const primaryKeys = tableSchema?.primary_keys as PrimaryKey[];

  const singleResourceData = await loadSingleResourceData(
    schema,
    resource,
    primaryKeys.reduce(
      (acc, key, index) => {
        acc[key.name] = pk[index];
        return acc;
      },
      {} as Record<string, unknown>,
    ),
  );
  if (!singleResourceData) return notFound();

  const resourceUrl = `/home/${schema}/resource/${resource}`;

  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[
          { title: formatTitle(resource), url: resourceUrl },
          { title: "View" },
        ]}
      />
      <ResourceContextProvider
        permissions={permissions}
        tableSchema={tableSchema}
        columnsSchema={columnsSchema}
      >
        <div className="mx-auto max-w-3xl p-4">
          <ResourceEditForm
            tableSchema={tableSchema}
            columnsSchema={columnsSchema ?? []}
            data={singleResourceData}
          />
        </div>
      </ResourceContextProvider>
    </div>
  );
}

export default withI18n(EditPage);
