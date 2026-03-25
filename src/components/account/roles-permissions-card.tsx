import { useQuery } from "@tanstack/react-query"

import { ShieldAlertIcon, ShieldIcon } from "lucide-react"

import { Badge } from "#/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { useUser } from "#/hooks/use-user"
import { rolesQueryOptions } from "#/lib/supabase/data/core"
import type { AppPermission } from "#/lib/supabase/data/core"

function formatPermission(permission: AppPermission): string {
  // "supasheet.users:select" → "Accounts · Select"
  const [, rest] = permission.split(".")
  const [resource, action] = rest.split(":")
  return `${resource.charAt(0).toUpperCase() + resource.slice(1)} · ${action.charAt(0).toUpperCase() + action.slice(1)}`
}

export function RolesPermissionsCard() {
  const user = useUser()
  const { data: roles = [], isLoading } = useQuery(rolesQueryOptions(user!.id))

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Roles & permissions</CardTitle>
        <CardDescription>
          Your assigned roles and the permissions each role grants.
        </CardDescription>
      </CardHeader>
      <CardContent className="divide-y p-0">
        {isLoading ? (
          <div className="px-6 py-4 text-sm text-muted-foreground">
            Loading…
          </div>
        ) : roles.length === 0 ? (
          <div className="flex items-center gap-3 px-6 py-4">
            <ShieldAlertIcon className="size-5 shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No roles assigned to your account.
            </p>
          </div>
        ) : (
          roles.map((userRole) => (
            <div key={userRole.id} className="flex items-start gap-3 px-6 py-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md border">
                <ShieldIcon className="size-5" />
              </div>
              <div className="flex-1 space-y-2 pt-1">
                <p className="text-sm leading-none font-medium">
                  {userRole.role}
                </p>
                {userRole.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {userRole.permissions.map((rp) => (
                      <Badge key={rp.id} variant="outline" className="text-xs">
                        {formatPermission(rp.permission)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No permissions assigned to this role.
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
