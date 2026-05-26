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

function groupPermissions(permissions: { permission: AppPermission }[]) {
  return permissions.reduce<Record<string, Record<string, string[]>>>(
    (acc, { permission }) => {
      const [schema, rest] = permission.split(".")
      const [table, operation] = rest.split(":")
      acc[schema] ??= {}
      acc[schema][table] ??= []
      acc[schema][table].push(operation)
      return acc
    },
    {},
  )
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
          roles.map((userRole) => {
            const grouped = groupPermissions(userRole.permissions)
            return (
              <div
                key={userRole.id}
                className="flex items-start gap-3 px-6 py-4"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md border">
                  <ShieldIcon className="size-5" />
                </div>
                <div className="flex-1 space-y-3 pt-1">
                  <p className="text-sm leading-none font-medium">
                    {userRole.role}
                  </p>
                  {Object.keys(grouped).length > 0 ? (
                    <div className="overflow-hidden rounded-md border divide-y">
                      {Object.entries(grouped).flatMap(([schema, tables]) => [
                        <div
                          key={`${schema}-header`}
                          className="bg-muted/50 px-3 py-1.5"
                        >
                          <span className="text-xs font-medium text-muted-foreground">
                            {schema}
                          </span>
                        </div>,
                        ...Object.entries(tables).map(
                          ([table, operations]) => (
                            <div
                              key={`${schema}.${table}`}
                              className="flex items-center gap-3 px-3 py-2"
                            >
                              <span className="w-36 shrink-0 text-xs font-medium">
                                {table}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {operations.map((op) => (
                                  <Badge
                                    key={op}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {op}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ),
                        ),
                      ])}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No permissions assigned to this role.
                    </p>
                  )}
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
