import { createFileRoute, notFound } from "@tanstack/react-router"

import { Card, CardContent, CardHeader } from "#/components/ui/card"
import { Skeleton } from "#/components/ui/skeleton"
import { UserDangerZone } from "#/components/users/user-danger-zone"
import { adminGetUserQueryOptions } from "#/lib/supabase/data/admin-auth"

export const Route = createFileRoute("/core/users/$userId/danger")({
  head: () => ({ meta: [{ title: "Danger Zone | Users | Supasheet" }] }),
  beforeLoad: ({ context, params: { userId } }) => {
    if (context.authUser?.id === userId) throw notFound()
    if (
      !context.permissions?.some(
        (p) => p.permission === "supasheet.users:delete"
      )
    )
      throw notFound()
  },
  loader: async ({ context, params }) => {
    const user = await context.queryClient.ensureQueryData(
      adminGetUserQueryOptions(params.userId)
    )
    if (!user?.user) throw notFound()
    return { data: user }
  },
  pendingComponent: () => (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-4">
      <Card className="border-destructive/50">
        <CardHeader className="border-b border-destructive/50">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-full max-w-md" />
            </div>
            <Skeleton className="h-8 w-[4.5rem] shrink-0 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = Route.useLoaderData()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-4">
      <UserDangerZone user={data.user} />
    </div>
  )
}
