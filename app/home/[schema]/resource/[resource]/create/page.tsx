import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ResourceCreateForm } from "@/features/resource/components/resource-create-form";
import {
  loadColumnsSchema,
  loadResourcePermissions,
  loadTableSchema,
} from "@/features/resource/lib/loaders";
import { DatabaseSchemas, DatabaseTables } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { withI18n } from "@/lib/i18n/with-i18n";

async function CreatePage({
  params,
}: {
  params: Promise<{
    schema: string;
    resource: string;
  }>;
}) {
  const { resource, schema } = (await params) as {
    schema: DatabaseSchemas;
    resource: DatabaseTables<typeof schema>;
  };

  const [tableSchema, columnsSchema, permissions] = await Promise.all([
    loadTableSchema(schema, resource),
    loadColumnsSchema(schema, resource),
    loadResourcePermissions(schema, resource),
  ]);

  if (!tableSchema) return notFound();
  if (!columnsSchema?.length) return notFound();
  if (!permissions.canInsert) return notFound();

  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[
          { title: formatTitle(resource), url: "." },
          { title: "Create" },
        ]}
      />
      <ResourceContextProvider permissions={permissions}>
        <div className="mx-auto max-w-3xl p-4">
          <ResourceCreateForm
            tableSchema={tableSchema}
            columnsSchema={columnsSchema ?? []}
          />
        </div>
      </ResourceContextProvider>
    </div>
  );
}

export default withI18n(CreatePage);
