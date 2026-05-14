import { useNavigate } from "@tanstack/react-router"

import {
  ChevronDownIcon,
  EyeIcon,
  HistoryIcon,
  MessageSquareIcon,
  PencilIcon,
} from "lucide-react"

import { useHasPermission } from "#/hooks/use-permissions"
import type { AppPermission } from "#/lib/supabase/data/core"
import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"

interface ResourceRecordActionsProps {
  schema: string
  resource: string
  resourceId: string
  isTable?: boolean
  mode?: "detail" | "update"
}

export function ResourceRecordActions({
  schema,
  resource,
  resourceId,
  isTable = false,
  mode = "detail",
}: ResourceRecordActionsProps) {
  const navigate = useNavigate()

  const canUpdate = useHasPermission(`${schema}.${resource}:update` as AppPermission)
  const canViewAudit = useHasPermission(`${schema}.${resource}:audit` as AppPermission)
  const canViewComments = useHasPermission(`${schema}.${resource}:comment` as AppPermission)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = { schema, resource, resourceId } as any

  const hasViewDetail = mode === "update"
  const hasEdit = mode === "detail" && isTable && canUpdate
  const hasMetaActions = canViewComments || canViewAudit
  const hasCrudActions = hasViewDetail || hasEdit

  if (!hasMetaActions && !hasCrudActions) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size="sm" variant="outline">
            Actions
            <ChevronDownIcon className="ml-1.5 size-3.5" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        {hasCrudActions && (
          <DropdownMenuGroup>
            {hasViewDetail && (
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: "/$schema/resource/$resource/$resourceId/detail",
                    params,
                  })
                }
              >
                <EyeIcon />
                View Detail
              </DropdownMenuItem>
            )}
            {hasEdit && (
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: "/$schema/resource/$resource/$resourceId/update",
                    params,
                  })
                }
              >
                <PencilIcon />
                Edit
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        )}
        {hasCrudActions && hasMetaActions && <DropdownMenuSeparator />}
        {hasMetaActions && (
          <DropdownMenuGroup>
            {canViewComments && (
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: "/$schema/resource/$resource/$resourceId/comment",
                    params,
                  })
                }
              >
                <MessageSquareIcon />
                Comments
              </DropdownMenuItem>
            )}
            {canViewAudit && (
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: "/$schema/resource/$resource/$resourceId/audit",
                    params,
                  })
                }
              >
                <HistoryIcon />
                Audit Log
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
