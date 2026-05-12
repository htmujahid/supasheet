import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

import { resourcesQueryOptions } from "#/lib/supabase/data/resource"

export const Route = createFileRoute("/$schema/resource/$resource/")({
  beforeLoad: async ({ context, params: { schema, resource } }) => {
    if (
      !context.permissions?.some(
        (p) => p.permission === `${schema}.${resource}:select`
      )
    )
      throw notFound()

    const resources = await context.queryClient.ensureQueryData(
      resourcesQueryOptions(schema)
    )
    const item = resources.find((r) => r.id === resource)
    const primary = item?.meta?.primaryItem
    const primaryItem = primary
      ? item?.meta?.items?.find((i) => i.id === primary)
      : null

    if (item?.meta?.single) {
      throw redirect({
        to: "/$schema/resource/$resource/single",
        params: { schema, resource },
      })
    }
    if (primaryItem?.type === "kanban") {
      throw redirect({
        to: "/$schema/resource/$resource/kanban/$kanbanId",
        params: { schema, resource, kanbanId: primaryItem.id },
        search: { layout: "board" },
      })
    }
    if (primaryItem?.type === "calendar") {
      throw redirect({
        to: "/$schema/resource/$resource/calendar/$calendarId",
        params: { schema, resource, calendarId: primaryItem.id },
        search: { view: "month" },
      })
    }
    if (primaryItem?.type === "gallery") {
      throw redirect({
        to: "/$schema/resource/$resource/gallery/$galleryId",
        params: { schema, resource, galleryId: primaryItem.id },
      })
    }
    if (primaryItem?.type === "list") {
      throw redirect({
        to: "/$schema/resource/$resource/list/$listId",
        params: { schema, resource, listId: primaryItem.id },
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
