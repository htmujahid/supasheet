import z from "zod"

import { ResourceDetailSheet } from "./resource-detail-sheet"
import { ResourceFormSheet } from "./resource-form-sheet"
import { ResourceImportSheet } from "./resource-import-sheet"

const overrideShape = {
  schema: z.string().optional(),
  resource: z.string().optional(),
}

export const sheetSearchSchema = z.discriminatedUnion("mode", [
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

export type SheetSearch = z.infer<typeof sheetSearchSchema>

type Props = {
  schema: string
  resource: string
  search: SheetSearch
  onClose: () => void
}

export function ResourceSheetRoute({
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
        <ResourceFormSheet
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
        <ResourceFormSheet
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
        <ResourceDetailSheet
          schema={targetSchema}
          resource={targetResource}
          pk={search.pk}
          open
          onOpenChange={onOpenChange}
        />
      )
    case "import":
      return (
        <ResourceImportSheet
          schema={targetSchema}
          resource={targetResource}
          open
          onOpenChange={onOpenChange}
        />
      )
  }
}
