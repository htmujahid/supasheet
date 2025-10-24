import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DefaultHeader } from "@/components/layouts/default-header";
import { ResourceKanbanView } from "@/features/resource/components/resource-kanban-view";
import {
  loadColumnsSchema,
  loadResourceKanbanViewData,
} from "@/features/resource/lib/loaders";
import {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
} from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { AlignStartHorizontalIcon, AlignStartVerticalIcon } from "lucide-react";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas>;
    view: DatabaseViews<DatabaseSchemas>;
  }>;
  searchParams: Promise<{ layout?: "list" | "board" }>;
}) {
  const { schema, resource, view } = await params;
  const { layout = "board" } = await searchParams;

  const columnSchema = await loadColumnsSchema(schema, view);

  const groupBy = columnSchema?.[0]?.name as string;

  if (!groupBy) {
    notFound();
  }

  const kanbanViewData = await loadResourceKanbanViewData(schema, view, groupBy);

  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[
          { title: formatTitle(resource), url: ".." },
          { title: formatTitle(view) },
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
        <ResourceKanbanView
          data={kanbanViewData}
          schema={schema}
          resource={resource}
          groupBy={groupBy}
          layout={layout}
        />
      </div>
    </div>
  );
}
