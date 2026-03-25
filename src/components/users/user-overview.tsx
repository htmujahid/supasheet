import type { User as AuthUser } from "@supabase/supabase-js"

import { format } from "date-fns"

import { Badge } from "#/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"

function isBanned(user: AuthUser): boolean {
  return !!user.banned_until && new Date(user.banned_until) > new Date()
}

export function UserOverview({ user }: { user: AuthUser }) {
  const banned = isBanned(user)

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          User info
          {banned && <Badge variant="destructive">Banned</Badge>}
          {user.email_confirmed_at && (
            <Badge variant="secondary">Email verified</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 py-4 text-sm">
        <div className="grid grid-cols-[8rem_1fr] gap-1">
          <span className="text-muted-foreground">ID</span>
          <span className="font-mono text-xs break-all">{user.id}</span>
        </div>
        <div className="grid grid-cols-[8rem_1fr] gap-1">
          <span className="text-muted-foreground">Email</span>
          <span>{user.email ?? "—"}</span>
        </div>
        <div className="grid grid-cols-[8rem_1fr] gap-1">
          <span className="text-muted-foreground">Phone</span>
          <span>{user.phone ?? "—"}</span>
        </div>
        <div className="grid grid-cols-[8rem_1fr] gap-1">
          <span className="text-muted-foreground">Created</span>
          <span>{format(new Date(user.created_at), "PPP")}</span>
        </div>
        {user.last_sign_in_at && (
          <div className="grid grid-cols-[8rem_1fr] gap-1">
            <span className="text-muted-foreground">Last sign-in</span>
            <span>{format(new Date(user.last_sign_in_at), "PPP p")}</span>
          </div>
        )}
        {banned && (
          <div className="grid grid-cols-[8rem_1fr] gap-1">
            <span className="text-muted-foreground">Banned until</span>
            <span>{format(new Date(user.banned_until!), "PPP p")}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
