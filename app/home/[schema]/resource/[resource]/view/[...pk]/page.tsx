import { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import { PencilIcon } from "lucide-react";

import { DefaultHeader } from "@/components/layouts/default-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ResourceDetailView } from "@/features/resource/components/view/resource-detail-view";
import { ResourceForeignDataView } from "@/features/resource/components/view/resource-foriegn-data-view";
import { ResourceMetadataView } from "@/features/resource/components/view/resource-metadata-view";
import {
  loadColumnsSchema,
  loadRelatedTablesSchema,
  loadResourcePermissions,
  loadSingleResourceData,
  loadTableSchema,
} from "@/features/resource/lib/loaders";
import {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  PrimaryKey,
  Relationship,
  TableMetadata,
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

  const relatedTablesSchema = await loadRelatedTablesSchema(schema, resource);

  const pkValues = pk.join("/");
  const editUrl = `/home/${schema}/resource/${resource}/edit/${pkValues}`;
  const resourceUrl = `/home/${schema}/resource/${resource}`;

  const joins: Required<TableMetadata>["query"]["join"] = [];

  const oneToOneRelationships = relatedTablesSchema.filter((table) => {
    return (table.relationships as Relationship[])?.some((rel) => {
      if (rel.source_schema === schema && rel.source_table_name === resource) {
        joins.push({
          table: rel.target_table_name,
          on: rel.target_column_name,
          columns: ["*"],
        });
        return true;
      }
      if (
        rel.target_table_schema === schema &&
        rel.target_table_name === resource &&
        (table.columns
          .filter((col) => col.is_unique)
          .some((col) => col.name === rel.source_column_name) ||
          ((table.primary_keys as PrimaryKey[]).some(
            (pk) => pk.name === rel.source_column_name,
          ) &&
            (table.primary_keys as PrimaryKey[])?.length === 1))
      ) {
        joins.push({
          table: rel.source_table_name,
          on: rel.source_column_name,
          columns: ["*"],
        });
        return true;
      }
    });
  });

  const oneToManyRelationships = relatedTablesSchema.filter((table) => {
    return (table.relationships as Relationship[]).some((rel) => {
      if (
        rel.target_table_schema === schema &&
        rel.target_table_name === resource &&
        !(
          table.columns
            .filter((col) => col.is_unique)
            .some((col) => col.name === rel.source_column_name) ||
          (table.primary_keys as PrimaryKey[]).some(
            (pk) => pk.name === rel.source_column_name,
          )
        )
      ) {
        joins.push({
          table: rel.source_table_name,
          on: rel.source_column_name,
          columns: ["*"],
        });
        return true;
      }
    });
  });

  const manyToManyRelationships = relatedTablesSchema.filter((table) => {
    return (table.relationships as Relationship[]).some((rel) => {
      if (
        rel.target_table_schema === schema &&
        rel.target_table_name === resource &&
        (table.relationships as Relationship[]).length >= 2 &&
        (table.primary_keys as PrimaryKey[]).length >= 2 &&
        (table.relationships as Relationship[]).filter((r) =>
          (table.primary_keys as PrimaryKey[]).some(
            (pk) => pk.name === r.source_column_name,
          ),
        )
      ) {
        joins.push({
          table: rel.source_table_name,
          on: rel.source_column_name,
          columns: [`*, ...${rel.target_table_name}(*)`],
        });
        return true;
      }
    });
  });

  const allManyRelationships = [
    ...oneToManyRelationships,
    ...manyToManyRelationships,
  ];

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
    {
      join: joins,
    },
  );

  if (!singleResourceData) return notFound();

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
        <div className="mx-auto max-w-7xl space-y-4 p-4">
          {/* Masonry Grid Layout - Pinterest Style */}
          <div className="columns-1 gap-4 lg:columns-2">
            {/* Main Resource Details */}
            <div className="mb-4 break-inside-avoid">
              <ResourceDetailView
                tableSchema={tableSchema}
                columnsSchema={columnsSchema ?? []}
                singleResourceData={singleResourceData}
                foreignKeyData={{}}
              />
            </div>

            {/* Metadata Section */}
            <div className="mb-4 break-inside-avoid">
              <ResourceMetadataView
                columnsSchema={columnsSchema ?? []}
                tableSchema={tableSchema}
                singleResourceData={singleResourceData}
              />
            </div>

            {/* Foreign Data Sections - One to One */}
            {oneToOneRelationships.map((relationship) => {
              const foreignKeyData = (
                tableSchema.relationships as Relationship[]
              ).find((rel) => {
                if (
                  rel.target_table_schema === schema &&
                  rel.target_table_name === resource &&
                  rel.source_table_name === relationship.name
                ) {
                  return true;
                }
                return false;
              }) as Relationship;

              return (
                <div key={relationship.id} className="mb-4 break-inside-avoid">
                  <ResourceDetailView
                    tableSchema={relationship}
                    columnsSchema={relationship.columns ?? []}
                    foreignKeyData={
                      foreignKeyData
                        ? {
                            [foreignKeyData.source_column_name]:
                              singleResourceData[
                                foreignKeyData.target_column_name
                              ],
                          }
                        : {}
                    }
                    singleResourceData={
                      singleResourceData[relationship.name] as Record<
                        string,
                        unknown
                      >
                    }
                  />
                </div>
              );
            })}
          </div>

          {/* Foreign Data Sections - One to Many */}
          {allManyRelationships.length > 0 && (
            <Tabs
              defaultValue={allManyRelationships[0]?.name?.toString() ?? ""}
            >
              <TabsList className="w-full">
                {allManyRelationships.map((relationship) => (
                  <TabsTrigger
                    key={relationship.id}
                    value={relationship.name?.toString() ?? ""}
                  >
                    {formatTitle(relationship.name as string)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {allManyRelationships.map((relationship) => {
                return (
                  <TabsContent
                    key={relationship.id}
                    value={relationship.name?.toString() ?? ""}
                  >
                    <ResourceForeignDataView
                      relationship={relationship}
                      data={
                        (singleResourceData[
                          relationship.name as string
                        ] as Record<string, unknown>[]) || null
                      }
                    />
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </ResourceContextProvider>
    </div>
  );
}

export default ResourceViewPage;
