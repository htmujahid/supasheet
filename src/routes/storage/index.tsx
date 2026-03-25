import { createFileRoute } from "@tanstack/react-router"

import { FolderOpenIcon } from "lucide-react"

import { DefaultHeader } from "#/components/layouts/default-header"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"

export const Route = createFileRoute("/storage/")({
  head: () => ({ meta: [{ title: "Storage | Supasheet" }] }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <DefaultHeader breadcrumbs={[{ title: "Storage" }]} />
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <FolderOpenIcon className="opacity-30" />
          </EmptyMedia>
          <EmptyTitle>No bucket selected</EmptyTitle>
          <EmptyDescription>
            Select a bucket from the sidebar to browse its files.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </>
  )
}
