import z from "zod"

import { ResourceDetailDrawer } from "./resource-detail-drawer"
import { ResourceFormDrawer } from "./resource-form-drawer"
import { ResourceImportDrawer } from "./resource-import-drawer"

const overrideShape = {
  schema: z.string().optional(),
  resource: z.string().optional(),
}

export const drawerSearchSchema = z.discriminatedUnion("mode", [
  z.object({
    ...overrideShape,
    mode: z.literal("create"),
    defaults: z.record(z.string(), z.string()).optional(),
  }),
  z.object({
    ...overrideShape,
    mode: z.literal("update"),
    pk: z.record(z.string(), z.unknown()),
  }),
  z.object({
    ...overrideShape,
    mode: z.literal("detail"),
    pk: z.record(z.string(), z.unknown()),
  }),
  z.object({ ...overrideShape, mode: z.literal("import") }),
])

export type DrawerSearch = z.infer<typeof drawerSearchSchema>

type Props = {
  schema: string
  resource: string
  search: DrawerSearch
  onClose: () => void
}

export function ResourceDrawerRoute({
  schema,
  resource,
  search,
  onClose,
}: Props) {
  const onOpenChange = (open: boolean) => {
    if (!open) onClose()
  }

  const targetSchema = search.schema ?? schema
  const targetResource = search.resource ?? resource

  switch (search.mode) {
    case "create":
      return (
        <ResourceFormDrawer
          mode="create"
          schema={targetSchema}
          resource={targetResource}
          defaults={search.defaults}
          open
          onOpenChange={onOpenChange}
        />
      )
    case "update":
      return (
        <ResourceFormDrawer
          mode="update"
          schema={targetSchema}
          resource={targetResource}
          pk={search.pk}
          open
          onOpenChange={onOpenChange}
        />
      )
    case "detail":
      return (
        <ResourceDetailDrawer
          schema={targetSchema}
          resource={targetResource}
          pk={search.pk}
          open
          onOpenChange={onOpenChange}
        />
      )
    case "import":
      return (
        <ResourceImportDrawer
          schema={targetSchema}
          resource={targetResource}
          open
          onOpenChange={onOpenChange}
        />
      )
  }
}
