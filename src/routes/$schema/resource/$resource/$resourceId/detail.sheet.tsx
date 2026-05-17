import { createFileRoute, useNavigate } from "@tanstack/react-router"

import {
  ResourceSheetRoute,
  sheetSearchSchema,
} from "#/components/resource/sheet/resource-sheet-route"

export const Route = createFileRoute(
  "/$schema/resource/$resource/$resourceId/detail/sheet"
)({
  validateSearch: sheetSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { schema, resource, resourceId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate()

  return (
    <ResourceSheetRoute
      schema={schema}
      resource={resource}
      search={search}
      onClose={() =>
        navigate({
          to: "/$schema/resource/$resource/$resourceId/detail",
          params: { schema, resource, resourceId },
        })
      }
    />
  )
}
