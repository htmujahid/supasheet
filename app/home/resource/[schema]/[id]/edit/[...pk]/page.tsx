import { notFound } from "next/navigation";

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
import { withI18n } from "@/lib/i18n/with-i18n";

async function EditPage({
  params,
}: {
  params: Promise<{
    schema: string;
    id: string;
    pk: string[];
  }>;
}) {
  const { id, pk, schema } = (await params) as {
    schema: DatabaseSchemas;
    id: DatabaseTables<typeof schema>;
    pk: string[];
  };

  const [tableSchema, columnsSchema, permissions] = await Promise.all([
    loadTableSchema(schema, id),
    loadColumnsSchema(schema, id),
    loadResourcePermissions(schema, id),
  ]);

  if (!tableSchema) return notFound();
  if (!columnsSchema?.length) return notFound();
  if (!permissions.canUpdate) return notFound();

  const primaryKeys = tableSchema?.primary_keys as PrimaryKey[];

  const singleResourceData = await loadSingleResourceData(
    schema,
    id,
    primaryKeys.reduce(
      (acc, key, index) => {
        acc[key.name] = pk[index];
        return acc;
      },
      {} as Record<string, unknown>,
    ),
  );
  if (!singleResourceData) return notFound();

  return (
    <ResourceContextProvider permissions={permissions}>
      <div className="mx-auto max-w-3xl p-4">
        <ResourceEditForm
          tableSchema={tableSchema}
          columnsSchema={columnsSchema ?? []}
          data={singleResourceData}
        />
      </div>
    </ResourceContextProvider>
  );
}

export default withI18n(EditPage);
