import { createFileRoute } from "@tanstack/react-router"

import { IdentityEmailCard } from "#/components/account/identity-email-card"
import { IdentityProvidersCard } from "#/components/account/identity-providers-card"
import { DefaultHeader } from "#/components/layouts/default-header"
import { identitiesQueryOptions } from "#/lib/supabase/data/identities"

export const Route = createFileRoute("/account/identities")({
  head: () => ({ meta: [{ title: "Identities | Supasheet" }] }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(identitiesQueryOptions)
  },
  component: IdentitiesPage,
})

function IdentitiesPage() {
  return (
    <div>
      <DefaultHeader
        breadcrumbs={[{ title: "Identities", url: "/account/identities" }]}
      />
      <div className="mx-auto w-full max-w-2xl space-y-4 p-6">
        <IdentityEmailCard />
        <IdentityProvidersCard />
      </div>
    </div>
  )
}
