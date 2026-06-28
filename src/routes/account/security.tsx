import { createFileRoute } from "@tanstack/react-router"

import { SecurityMfaCard } from "#/components/account/security-mfa-card"
import { SecurityPasswordCard } from "#/components/account/security-password-card"
import { DefaultHeader } from "#/components/layouts/default-header"
import { pageTitle } from "#/lib/page-title"
import { mfaFactorsQueryOptions } from "#/lib/supabase/data/security"

export const Route = createFileRoute("/account/security")({
  head: () => ({ meta: [{ title: pageTitle("Security") }] }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(mfaFactorsQueryOptions)
  },
  component: SecurityPage,
})

function SecurityPage() {
  return (
    <div>
      <DefaultHeader
        breadcrumbs={[{ title: "Security", url: "/account/security" }]}
      />
      <div className="mx-auto w-full max-w-2xl space-y-4 p-6">
        <SecurityPasswordCard />
        <SecurityMfaCard />
      </div>
    </div>
  )
}
