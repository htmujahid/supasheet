import { notFound } from "next/navigation";

import { ResourceEditForm } from "@/features/resource/components/resource-edit-form";
import {
  loadColumnsSchema,
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

  const tableSchema = await loadTableSchema(schema, id);
  if (!tableSchema) return notFound();

  const columnsSchema = await loadColumnsSchema(schema, id);
  if (!columnsSchema?.length) return notFound();

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
    <div className="mx-auto max-w-3xl p-4">
      <ResourceEditForm
        tableSchema={tableSchema}
        columnsSchema={columnsSchema ?? []}
        data={singleResourceData}
      />
    </div>
  );
}

export default withI18n(EditPage);
