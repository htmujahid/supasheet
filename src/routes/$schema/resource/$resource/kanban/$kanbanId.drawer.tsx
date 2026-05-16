import { createFileRoute, useNavigate } from "@tanstack/react-router"

import {
  ResourceDrawerRoute,
  drawerSearchSchema,
} from "#/components/resource/drawer/resource-drawer-route"

export const Route = createFileRoute(
  "/$schema/resource/$resource/kanban/$kanbanId/drawer"
)({
  validateSearch: drawerSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { schema, resource, kanbanId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate()

  return (
    <ResourceDrawerRoute
      schema={schema}
      resource={resource}
      search={search}
      onClose={() =>
        navigate({
          to: "/$schema/resource/$resource/kanban/$kanbanId",
          params: { schema, resource, kanbanId },
          search: { layout: "board" },
        })
      }
    />
  )
}
