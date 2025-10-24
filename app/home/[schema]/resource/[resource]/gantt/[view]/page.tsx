import { DefaultHeader } from "@/components/layouts/default-header";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ResourceGanttView } from "@/features/resource/components/resource-gannt-view";
import { loadResourceGanttViewData } from "@/features/resource/lib/loaders";
import { DatabaseSchemas, DatabaseTables, DatabaseViews } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { CalendarRangeIcon, Grid2x2Icon, Grid3x3Icon } from "lucide-react";
import Link from "next/link";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{
    schema: DatabaseSchemas;
    resource: DatabaseTables<DatabaseSchemas>;
    view: DatabaseViews<DatabaseSchemas>;
  }>;
  searchParams: Promise<{ layout?: "daily" | "monthly" | "quarterly" }>;
}) {
  const { schema, resource, view } = await params;
  const { layout = "monthly" } = await searchParams;

  const features = await loadResourceGanttViewData(schema, view);

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
            size={"icon-sm"}
            variant={layout === "daily" ? "default" : "outline"}
            asChild
          >
            <Link href={"?layout=daily"}>
              <CalendarRangeIcon className="size-4" />
            </Link>
          </Button>
          <Button
            size={"icon-sm"}
            variant={layout === "monthly" ? "default" : "outline"}
            asChild
          >
            <Link href={"?layout=monthly"}>
              <Grid3x3Icon className="size-4" />
            </Link>
          </Button>
          <Button
            size={"icon-sm"}
            variant={layout === "quarterly" ? "default" : "outline"}
            asChild
          >
            <Link href={"?layout=quarterly"}>
              <Grid2x2Icon className="size-4" />
            </Link>
          </Button>
        </ButtonGroup>
      </DefaultHeader>
      <div className="p-4">
        <ResourceGanttView features={features} layout={layout} />
      </div>
    </div>
  )
}