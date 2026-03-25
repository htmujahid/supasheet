import { Link, createFileRoute, useRouter } from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"

import { AlertCircleIcon, FileXIcon } from "lucide-react"

import { Button } from "#/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import { formatTitle } from "#/lib/format"

export const Route = createFileRoute("/$schema/resource/$resource/report")({
  head: ({ params }) => ({
    meta: [{ title: `Report | ${formatTitle(params.resource)} | Supasheet` }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }: ErrorComponentProps) => {
    const { schema, resource } = Route.useParams()
    const router = useRouter()
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircleIcon />
            </EmptyMedia>
            <EmptyTitle>Something went wrong</EmptyTitle>
            <EmptyDescription>
              {error?.message ?? "An unexpected error occurred."}
            </EmptyDescription>
          </EmptyHeader>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                router.navigate({ to: `/${schema}/resource/${resource}` })
              }
            >
              Go Back
            </Button>
          </div>
        </Empty>
      </div>
    )
  },
  notFoundComponent: () => {
    const { schema, resource } = Route.useParams()
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileXIcon />
            </EmptyMedia>
            <EmptyTitle>Report not found</EmptyTitle>
            <EmptyDescription>
              This report doesn't exist.{" "}
              <Link
                to="/$schema/resource/$resource"
                params={{ schema, resource }}
              >
                Back to {formatTitle(resource)}
              </Link>
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  },
})

function RouteComponent() {
  return <div>Hello "/$schema/resource/$resource/report"!</div>
}
