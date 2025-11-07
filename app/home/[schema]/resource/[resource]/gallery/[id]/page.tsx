import { Metadata } from "next";

import { notFound } from "next/navigation";

import { get } from "lodash";
import { SearchParams } from "nuqs";

import { DefaultHeader } from "@/components/layouts/default-header";
import { If } from "@/components/makerkit/if";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ResourceGalleryView } from "@/features/resource/components/resource-gallery";
import { ResourceSheet } from "@/features/resource/components/resource-sheet";
import {
  loadColumnsSchema,
  loadResourceData,
  loadResourcePermissions,
  loadTableSchema,
  loadViewSchema,
} from "@/features/resource/lib/loaders";
import { resourceSearchParamsCache } from "@/features/resource/lib/validations";
import {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  TableMetadata,
  ViewMetadata,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

type ResourceGalleryPageProps = {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas> | DatabaseViews<DatabaseSchemas>;
    id: string;
  }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  params,
}: ResourceGalleryPageProps): Promise<Metadata> {
  const { schema, resource } = await params;

  return {
    title: `${formatTitle(resource)} Gallery - ${formatTitle(schema)}`,
  };
}

async function ResourceGalleryPage({
  params,
  searchParams,
}: ResourceGalleryPageProps) {
  const { resource, schema, id } = await params;

  const { page = "1", perPage = "1000", ...rest } = await searchParams;
  const search = resourceSearchParamsCache.parse({ page, perPage, ...rest });

  const tableSchema = await loadTableSchema(schema, resource);
  const viewSchema = await loadViewSchema(schema, resource);

  const tableMeta = JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata;
  const viewMeta = JSON.parse(viewSchema?.comment ?? "{}") as ViewMetadata;

  const meta = tableSchema ? tableMeta : viewMeta;

  const currentView = meta.items?.find(
    (item) => item.id === id && item.type === "gallery",
  );

  if (!currentView) {
    notFound();
  }

  const titleFieldName = currentView.title as string;
  const descriptionFieldName = currentView.description as string;
  const badgeFieldName = currentView.badge as string;
  const coverFieldName = currentView.cover as string;

  const [columnsSchema, data, permissions] = await Promise.all([
    loadColumnsSchema(schema, resource),
    loadResourceData(schema, resource, search, tableMeta.query),
    loadResourcePermissions(schema, resource),
  ]);

  if (
    !coverFieldName ||
    !titleFieldName ||
    !descriptionFieldName ||
    !columnsSchema?.length
  ) {
    notFound();
  }

  const results = data?.results || [];

  const arrangedData = results.map((item) => {
    return {
      title: get(item, titleFieldName) as string,
      description: get(item, descriptionFieldName) as string,
      badge: get(item, badgeFieldName) as string,
      cover: get(item, coverFieldName)[0] as string,
      data: item,
    };
  });

  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[
          { title: formatTitle(resource), url: ".." },
          { title: formatTitle(id) },
        ]}
      >
        <If condition={permissions.canInsert}>
          <ResourceSheet
            tableSchema={tableSchema}
            columnsSchema={columnsSchema}
            data={null}
            create={true}
            showTrigger={true}
          />
        </If>
      </DefaultHeader>
      <div className="px-4">
        <ResourceContextProvider
          permissions={permissions}
          tableSchema={tableSchema}
          columnsSchema={columnsSchema}
        >
          <ResourceGalleryView
            data={arrangedData}
            columnsSchema={columnsSchema}
          />
        </ResourceContextProvider>
      </div>
    </div>
  );
}

export default ResourceGalleryPage;
