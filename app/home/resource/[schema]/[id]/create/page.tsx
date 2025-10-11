import { notFound } from "next/navigation";

import { ResourceCreateForm } from "@/features/resource/components/resource-create-form";
import {
  loadColumnsSchema,
  loadTableSchema,
} from "@/features/resource/lib/loaders";
import { DatabaseSchemas, DatabaseTables } from "@/lib/database-meta.types";
import { withI18n } from "@/lib/i18n/with-i18n";

async function CreatePage({
  params,
}: {
  params: Promise<{
    schema: string;
    id: string;
  }>;
}) {
  const { id, schema } = (await params) as {
    schema: DatabaseSchemas;
    id: DatabaseTables<typeof schema>;
  };

  const tableSchema = await loadTableSchema(schema, id);
  if (!tableSchema) return notFound();

  const columnsSchema = await loadColumnsSchema(schema, id);
  if (!columnsSchema?.length) return notFound();

  return (
    <div className="mx-auto max-w-3xl p-4">
      <ResourceCreateForm
        tableSchema={tableSchema}
        columnsSchema={columnsSchema ?? []}
      />
    </div>
  );
}

export default withI18n(CreatePage);
