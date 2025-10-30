import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DefaultHeader } from "@/components/layouts/default-header";
import { ResourceKanbanView } from "@/features/resource/components/resource-kanban";
import {
  loadColumnsSchema,
  loadResourceData,
  loadResourcePermissions,
  loadTableSchema,
} from "@/features/resource/lib/loaders";
import {
  DatabaseSchemas,
  DatabaseTables,
  PrimaryKey,
  TableMetadata,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { AlignStartHorizontalIcon, AlignStartVerticalIcon } from "lucide-react";
import { resourceSearchParamsCache } from "@/features/resource/lib/validations";
import { ResourceContextProvider } from "@/features/resource/components/resource-context";
import { ListViewReducedData } from "@/features/resource/lib/types";

export default async function Page(props: {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas>;
    id: string;
  }>;
  searchParams: Promise<{
    layout: "list" | "board";
    page: string;
    perPage: string;
  }>;
}) {
  const { resource, schema, id } = await props.params;

  const { page = '1', perPage = "1000", layout = "board", ...rest } = await props.searchParams;
  const search = resourceSearchParamsCache.parse({ page, perPage, ...rest });

  const tableSchema = await loadTableSchema(schema, resource);

  const meta = (tableSchema?.comment ? JSON.parse(tableSchema.comment) : {}) as TableMetadata;

  const currentView = meta.items?.find((item) => item.id === id);

  if (!currentView) {
    notFound();
  }

  const [columnsSchema, data] = await Promise.all([
    loadColumnsSchema(schema, resource),
    loadResourceData(schema, resource, search),
  ]);

  const groupFieldName = currentView.group as string;
  const titleFieldName = currentView.title as string;
  const descriptionFieldName = currentView.description as string;
  const badgeFieldName = currentView.badge as string;
  const dateFieldName = currentView.date as string;

  const primaryKeys = tableSchema?.primary_keys as PrimaryKey[];

  if (
    !groupFieldName ||
    !titleFieldName ||
    !dateFieldName ||
    !columnsSchema?.length
  ) {
    notFound();
  }

  const groupedData = data.results.reduce((acc, item) => {
    const groupKey = item[groupFieldName] as string;
    
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }

    const pk = primaryKeys.reduce((pkAcc, pkField) => {
      pkAcc[pkField.name] = item[pkField.name];
      return pkAcc;
    }, {} as Record<string, unknown>);

    acc[groupKey].push({
      pk: pk,
      title: item[titleFieldName] as string,
      description: item[descriptionFieldName] as string,
      date: item[dateFieldName] as string,
      badge: item[badgeFieldName] as string,
    });

    return acc;
  }, {} as ListViewReducedData);

  const permissions = await loadResourcePermissions(schema, resource);

  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[
          { title: formatTitle(resource), url: ".." },
          { title: formatTitle(id) },
        ]}
      >
        <ButtonGroup>
          <Button
            size="icon-sm"
            variant={layout === "board" ? "default" : "outline"}
            asChild
          >
            <Link href={"?layout=board"}>
              <AlignStartHorizontalIcon />
            </Link>
          </Button>
          <Button
            size="icon-sm"
            variant={layout === "list" ? "default" : "outline"}
            asChild
          >
            <Link href={"?layout=list"}>
              <AlignStartVerticalIcon />
            </Link>
          </Button>
        </ButtonGroup>
      </DefaultHeader>
      <div className="p-4">
        <ResourceContextProvider permissions={permissions}>
          <ResourceKanbanView
            data={groupedData}
            schema={schema}
            resource={resource}
            groupBy={groupFieldName}
            layout={layout}
          />
        </ResourceContextProvider>
      </div>
    </div>
  );
}