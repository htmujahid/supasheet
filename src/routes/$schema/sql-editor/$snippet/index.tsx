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

export const Route = createFileRoute("/$schema/sql-editor/$snippet/")({
  head: ({ params }) => ({
    meta: [{ title: `SQL Editor | ${formatTitle(params.schema)} | Supasheet` }],
  }),
  component: RouteComponent,
  errorComponent: ({ error }: ErrorComponentProps) => {
    const { schema } = Route.useParams()
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
              onClick={() => router.navigate({ to: `/${schema}` })}
            >
              Go Back
            </Button>
          </div>
        </Empty>
      </div>
    )
  },
  notFoundComponent: () => {
    const { schema } = Route.useParams()
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileXIcon />
            </EmptyMedia>
            <EmptyTitle>Snippet not found</EmptyTitle>
            <EmptyDescription>
              This SQL snippet doesn't exist.{" "}
              <Link to="/$schema" params={{ schema }}>
                Go home
              </Link>
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  },
})

function RouteComponent() {
  return <div>Hello "/$schema/sql-editor/$snippet/"!</div>
}
