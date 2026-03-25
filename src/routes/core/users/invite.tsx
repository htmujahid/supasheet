import { createFileRoute } from "@tanstack/react-router"

import { DefaultHeader } from "#/components/layouts/default-header"
import { UserInviteForm } from "#/components/users/user-invite-form"

export const Route = createFileRoute("/core/users/invite")({
  head: () => ({ meta: [{ title: "Invite User | Supasheet" }] }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <DefaultHeader
        breadcrumbs={[
          { title: "Users", url: "/core/users" },
          { title: "Invite user" },
        ]}
      />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-4">
            <UserInviteForm />
          </div>
        </div>
      </div>
    </>
  )
}
