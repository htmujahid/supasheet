import { Metadata } from "next";

import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { DeleteResourceDialog } from "@/features/resource/components/delete-resource-dialog";
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

type ResourceEditPageProps = {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas>;
    pk: string[];
  }>;
};

export async function generateMetadata({
  params,
}: ResourceEditPageProps): Promise<Metadata> {
  const { schema, resource } = await params;

  return {
    title: `Edit ${formatTitle(resource)} - ${formatTitle(schema)}`,
  };
}

async function ResourceEditPage({ params }: ResourceEditPageProps) {
  const { resource, pk, schema } = await params;

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
          { title: "Edit" },
        ]}
      >
        {permissions.canDelete && (
          <DeleteResourceDialog
            resources={[singleResourceData]}
            tableSchema={tableSchema}
            columnSchema={columnsSchema}
            showTrigger={true}
          />
        )}
      </DefaultHeader>
      <ResourceContextProvider
        permissions={permissions}
        tableSchema={tableSchema}
        columnsSchema={columnsSchema}
      >
        <div className={`mx-auto max-w-3xl p-4`}>
          {/* Resource Edit */}
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

export default ResourceEditPage;
