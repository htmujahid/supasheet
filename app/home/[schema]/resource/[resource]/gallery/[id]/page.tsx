import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ResourceGalleryView } from "@/features/resource/components/resource-gallery";
import {
  loadColumnsSchema,
  loadResourceData,
  loadResourcePermissions,
  loadTableSchema,
} from "@/features/resource/lib/loaders";
import { resourceSearchParamsCache } from "@/features/resource/lib/validations";
import {
  DatabaseSchemas,
  DatabaseTables,
  TableMetadata,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { withI18n } from "@/lib/i18n/with-i18n";

async function HomeResourcePage(props: {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas>;
    id: string;
  }>;
  searchParams: Promise<{
    page: string;
    perPage: string;
  }>;
}) {
  const { resource, schema, id } = await props.params;

  const { page = "1", perPage = "1000", ...rest } = await props.searchParams;
  const search = resourceSearchParamsCache.parse({ page, perPage, ...rest });

  const tableSchema = await loadTableSchema(schema, resource);

  if (!tableSchema) {
    notFound();
  }

  const meta = (
    tableSchema?.comment ? JSON.parse(tableSchema.comment) : {}
  ) as TableMetadata;

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
    loadResourceData(schema, resource, search),
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
      title: item[titleFieldName] as string,
      description: item[descriptionFieldName] as string,
      badge: item[badgeFieldName] as string,
      cover: item[coverFieldName][0] as string,
      data: item,
    };
  });

  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: formatTitle(resource) }]} />
      <div className="px-4">
        <ResourceContextProvider
          permissions={permissions}
          tableSchema={tableSchema}
          columnsSchema={columnsSchema}
        >
          <ResourceGalleryView data={arrangedData} />
        </ResourceContextProvider>
      </div>
    </div>
  );
}

export default withI18n(HomeResourcePage);
