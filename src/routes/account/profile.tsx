import { createFileRoute } from "@tanstack/react-router"

import { ProfileAvatarCard } from "#/components/account/profile-avatar-card"
import { ProfileNameCard } from "#/components/account/profile-name-card"
import { DefaultHeader } from "#/components/layouts/default-header"
import { pageTitle } from "#/lib/page-title"

export const Route = createFileRoute("/account/profile")({
  head: () => ({ meta: [{ title: pageTitle("Profile") }] }),
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <div>
      <DefaultHeader
        breadcrumbs={[{ title: "Profile", url: "/account/profile" }]}
      />
      <div className="mx-auto w-full max-w-2xl space-y-4 p-6">
        <ProfileAvatarCard />
        <ProfileNameCard />
      </div>
    </div>
  )
}
