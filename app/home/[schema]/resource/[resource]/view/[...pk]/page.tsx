import { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";
import { PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DefaultHeader } from "@/components/layouts/default-header";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ResourceDetailView } from "@/features/resource/components/view/resource-detail-view";
import { ResourceForiegnDataView } from "@/features/resource/components/view/resource-foriegn-data-view";
import { ResourceMetadataView } from "@/features/resource/components/view/resource-metadata-view";
import {
  loadColumnsSchema,
  loadResourcePermissions,
  loadSingleResourceData,
  loadTableSchema,
} from "@/features/resource/lib/loaders";
import {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  PrimaryKey,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

type ResourceViewPageProps = {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas> | DatabaseViews<DatabaseSchemas>;
    pk: string[];
  }>;
};

export async function generateMetadata({
  params,
}: ResourceViewPageProps): Promise<Metadata> {
  const { schema, resource } = await params;

  return {
    title: `${formatTitle(resource)} - ${formatTitle(schema)}`,
  };
}

async function ResourceViewPage({ params }: ResourceViewPageProps) {
  const { resource, pk, schema } = await params;

  const [tableSchema, columnsSchema, permissions] = await Promise.all([
    loadTableSchema(schema, resource),
    loadColumnsSchema(schema, resource),
    loadResourcePermissions(schema, resource),
  ]);

  if (!tableSchema) return notFound();
  if (!columnsSchema?.length) return notFound();
  if (!permissions.canSelect) return notFound();

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

  const pkValues = pk.join("/");
  const editUrl = `/home/${schema}/resource/${resource}/edit/${pkValues}`;
  const resourceUrl = `/home/${schema}/resource/${resource}`;

  const MetaDataSection = (
    <ResourceMetadataView
      columnsSchema={columnsSchema ?? []}
      tableSchema={tableSchema}
      singleResourceData={singleResourceData ?? {}}
    />
  );

  const ForeignDataSection = (
    <ResourceForiegnDataView
      tableSchema={tableSchema}
      singleResourceData={singleResourceData ?? {}}
    />
  );

  const hasSideBarContent = MetaDataSection || ForeignDataSection;

  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[
          { title: formatTitle(resource), url: resourceUrl },
          { title: "View" },
        ]}
      >
        {editUrl && permissions.canUpdate && (
          <Button asChild size="sm" variant={"outline"}>
            <Link href={editUrl}>
              <PencilIcon className="size-4" />
              Edit {formatTitle(resource)}
            </Link>
          </Button>
        )}
      </DefaultHeader>
      <ResourceContextProvider
        permissions={permissions}
        tableSchema={tableSchema}
        columnsSchema={columnsSchema}
      >
        <div className={`mx-auto ${hasSideBarContent ? "max-w-6xl" : "max-w-3xl"} p-4`}>
          <div className="grid grid-cols-6 gap-4">
            {/* Resource Details */}
            <div className={hasSideBarContent ? "col-span-6 lg:col-span-4" : "col-span-6"}>
              <ResourceDetailView
                tableSchema={tableSchema}
                columnsSchema={columnsSchema ?? []}
                singleResourceData={singleResourceData ?? {}}
              />
            </div>
            {
              hasSideBarContent ? (
                <div className="col-span-6 lg:col-span-2 flex flex-col gap-4">
                  {MetaDataSection}
                  {ForeignDataSection}
                </div>
              ) : null
            }
          </div>
        </div>
      </ResourceContextProvider>
    </div>
  );
}

export default ResourceViewPage;
