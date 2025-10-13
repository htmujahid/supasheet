import { notFound } from "next/navigation";

import { ResourceDetailView } from "@/features/resource/components/view/resource-detail-view";
import { ResourceForiegnDataView } from "@/features/resource/components/view/resource-foriegn-data-view";
import { ResourceMetadataView } from "@/features/resource/components/view/resource-metadata-view";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import {
  loadColumnsSchema,
  loadSingleResourceData,
  loadTableSchema,
  loadResourcePermissions,
} from "@/features/resource/lib/loaders";
import {
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
} from "@/lib/database-meta.types";
import { withI18n } from "@/lib/i18n/with-i18n";

async function ViewPage({
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
  if (!permissions.canSelect) return notFound();

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

  const pkValues = pk.join("/");
  const editUrl = `/home/resource/${schema}/${id}/edit/${pkValues}`;

  return (
    <ResourceContextProvider permissions={permissions}>
      <div className="mx-auto max-w-3xl p-4">
        <div className="flex flex-col gap-4">
          {/* Resource Details */}
          <ResourceDetailView
            editUrl={editUrl}
            columnsSchema={columnsSchema ?? []}
            singleResourceData={singleResourceData ?? {}}
          />

          {/* Metadata */}
          <ResourceMetadataView
            columnsSchema={columnsSchema ?? []}
            singleResourceData={singleResourceData ?? {}}
          />

          {/* Foreign Key Data */}
          <ResourceForiegnDataView
            tableSchema={tableSchema}
            singleResourceData={singleResourceData ?? {}}
          />
        </div>
      </div>
    </ResourceContextProvider>
  );
}

export default withI18n(ViewPage);
