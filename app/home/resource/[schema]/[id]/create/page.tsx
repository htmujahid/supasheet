import { notFound } from "next/navigation";

import { ResourceCreateForm } from "@/features/resource/components/resource-create-form";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import {
  loadColumnsSchema,
  loadTableSchema,
  loadResourcePermissions,
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

  const [tableSchema, columnsSchema, permissions] = await Promise.all([
    loadTableSchema(schema, id),
    loadColumnsSchema(schema, id),
    loadResourcePermissions(schema, id),
  ]);

  if (!tableSchema) return notFound();
  if (!columnsSchema?.length) return notFound();
  if (!permissions.canInsert) return notFound();

  return (
    <ResourceContextProvider permissions={permissions}>
      <div className="mx-auto max-w-3xl p-4">
        <ResourceCreateForm
          tableSchema={tableSchema}
          columnsSchema={columnsSchema ?? []}
        />
      </div>
    </ResourceContextProvider>
  );
}

export default withI18n(CreatePage);
