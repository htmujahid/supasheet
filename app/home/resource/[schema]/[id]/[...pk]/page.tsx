// import { SquarePenIcon, TrashIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

import { ResourceDetailView } from "@/features/resource/components/view/resource-detail-view";
import { ResourceForiegnDataView } from "@/features/resource/components/view/resource-foriegn-data-view";
import { ResourceMetadataView } from "@/features/resource/components/view/resource-metadata-view";
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

  const tableSchema = await loadTableSchema(id);
  if (!tableSchema) return notFound();

  const columnsSchema = await loadColumnsSchema(id);
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
      <div className="space-y-2.5">
        {/* Resource Details */}
        <ResourceDetailView
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
  );
}

export default withI18n(ViewPage);
