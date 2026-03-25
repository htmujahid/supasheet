import { useRouterState } from "@tanstack/react-router"

import type { AppPermission } from "#/lib/supabase/data/core"

type PermissionRow = { permission: AppPermission }

function usePermissions(): PermissionRow[] | null {
  return useRouterState({
    select: (s) => {
      const match = s.matches.find((m) => "permissions" in (m.context ?? {}))
      return (
        (match?.context as { permissions?: PermissionRow[] | null })
          ?.permissions ?? null
      )
    },
  })
}

export function useHasPermission(permission: AppPermission): boolean {
  const permissions = usePermissions()
  return permissions?.some((p) => p.permission === permission) ?? false
}
