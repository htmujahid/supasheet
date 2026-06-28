import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

import { resourcesQueryOptions } from "#/lib/supabase/data/resource"

export const Route = createFileRoute("/$schema/resource/$resource/")({
  beforeLoad: async ({ context, params: { schema, resource } }) => {
    const hasPermission = context.permissions?.some(
      (p) => p.permission === `${schema}.${resource}:select`
    )
    const hasPrivilege = context.privileges?.includes("select")
    const canSelect = context.authUser
      ? hasPermission && hasPrivilege
      : hasPrivilege
    if (!canSelect) throw notFound()

    const resources = await context.queryClient.ensureQueryData(
      resourcesQueryOptions(schema)
    )
    const item = resources.find((r) => r.id === resource)
    const primary = item?.meta?.primary_view
    const primaryView = primary
      ? item?.meta?.views?.find((i) => i.id === primary)
      : null

    if (item?.meta?.singleton) {
      throw redirect({
        to: "/$schema/resource/$resource/single",
        params: { schema, resource },
      })
    }
    if (primaryView?.type === "kanban") {
      throw redirect({
        to: "/$schema/resource/$resource/kanban/$kanbanId",
        params: { schema, resource, kanbanId: primaryView.id },
        search: { layout: "board" },
      })
    }
    if (primaryView?.type === "calendar") {
      throw redirect({
        to: "/$schema/resource/$resource/calendar/$calendarId",
        params: { schema, resource, calendarId: primaryView.id },
        search: { view: "month" },
      })
    }
    if (primaryView?.type === "gallery") {
      throw redirect({
        to: "/$schema/resource/$resource/gallery/$galleryId",
        params: { schema, resource, galleryId: primaryView.id },
      })
    }
    if (primaryView?.type === "list") {
      throw redirect({
        to: "/$schema/resource/$resource/list/$listId",
        params: { schema, resource, listId: primaryView.id },
      })
    }
    if (primaryView?.type === "tree") {
      throw redirect({
        to: "/$schema/resource/$resource/tree/$treeId",
        params: { schema, resource, treeId: primaryView.id },
      })
    }
    if (primary === "grid") {
      throw redirect({
        to: "/$schema/resource/$resource/grid",
        params: { schema, resource },
      })
    }
    throw redirect({
      to: "/$schema/resource/$resource/table",
      params: { schema, resource },
    })
  },
})
