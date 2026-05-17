import { useNavigate } from "@tanstack/react-router"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Eye, Image as ImageIcon, Pencil, Trash } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "#/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "#/components/ui/context-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import { useHasPermission } from "#/hooks/use-permissions"
import type {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  PrimaryKey,
  ResourceSchema,
} from "#/lib/database-meta.types"
import { isTableSchema } from "#/lib/database-meta.types"
import { getPkValue } from "#/lib/fields"
import { deleteResourceMutationOptions } from "#/lib/supabase/data/resource"
import { cn } from "#/lib/utils"

export interface GalleryViewData {
  cover: string | null
  title: string | null
  description: string | null
  badge: string | null
  data: Record<string, unknown>
}

interface ResourceGalleryProps {
  data: GalleryViewData[]
  resourceSchema: ResourceSchema
}

export function ResourceGallery({
  data,
  resourceSchema,
}: ResourceGalleryProps) {
  const schema = resourceSchema.schema ?? ""
  const resource = resourceSchema.name ?? ""
  const primaryKeys = (
    isTableSchema(resourceSchema) ? (resourceSchema.primary_keys ?? []) : []
  ) as PrimaryKey[]
  const isTable = isTableSchema(resourceSchema)

  return (
    <div className="flex flex-col gap-4">
      {data.length === 0 ? (
        <Empty className="min-h-[400px] border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImageIcon />
            </EmptyMedia>
            <EmptyTitle>No items to display</EmptyTitle>
            <EmptyDescription>
              There are no gallery items available at the moment.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((item, index) => {
            const resourceId = getPkValue(item.data, primaryKeys)
            return (
              <GalleryContextMenu
                key={index}
                item={item}
                schema={schema}
                resource={resource}
                resourceId={resourceId}
                primaryKeys={primaryKeys}
                isTable={isTable}
              >
                <Card className="cursor-pointer">
                  <CardHeader>
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-muted">
                      {item.cover ? (
                        <img
                          src={item.cover}
                          alt={item.title ?? "Gallery item"}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                            const sibling = target.nextElementSibling
                            if (sibling) sibling.classList.remove("hidden")
                          }}
                        />
                      ) : null}
                      <div
                        className={cn(
                          "absolute inset-0 flex items-center justify-center",
                          item.cover && "hidden"
                        )}
                      >
                        <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                      </div>
                      {item.badge && (
                        <Badge className="absolute top-2 right-2 capitalize">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{item.title ?? "Untitled"}</CardTitle>
                    {item.description && (
                      <CardDescription>{item.description}</CardDescription>
                    )}
                  </CardContent>
                </Card>
              </GalleryContextMenu>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GalleryContextMenu<S extends DatabaseSchemas>({
  children,
  item,
  schema,
  resource,
  resourceId,
  primaryKeys,
  isTable,
}: {
  children: React.ReactNode
  item: GalleryViewData
  schema: S
  resource: DatabaseViews<S> | DatabaseTables<S>
  resourceId: string
  primaryKeys: PrimaryKey[]
  isTable: boolean
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const canUpdate = useHasPermission(`${schema}.${resource}:update`)
  const canDelete = useHasPermission(`${schema}.${resource}:delete`)
  const { mutateAsync: deleteRow } = useMutation(
    deleteResourceMutationOptions(schema, resource)
  )

  async function handleDelete() {
    const pk = Object.fromEntries(
      primaryKeys.map((pkField) => [pkField.name, item.data[pkField.name]])
    )
    try {
      await deleteRow(pk)
      queryClient.invalidateQueries({
        queryKey: ["supasheet", "resource-data", schema, resource],
      })
      toast.success("Record deleted")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete record"
      )
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem
          onClick={() =>
            navigate({
              to: "/$schema/resource/$resource/$resourceId/detail",
              params: { schema, resource, resourceId },
            })
          }
        >
          <Eye className="size-4" />
          View Details
        </ContextMenuItem>
        {isTable && canUpdate && (
          <ContextMenuItem
            onClick={() =>
              navigate({
                to: "/$schema/resource/$resource/$resourceId/update",
                params: { schema, resource, resourceId },
              })
            }
          >
            <Pencil className="size-4" />
            Edit Details
          </ContextMenuItem>
        )}
        {isTable && canDelete && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive" onClick={handleDelete}>
              <Trash className="size-4" />
              Delete Item
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
