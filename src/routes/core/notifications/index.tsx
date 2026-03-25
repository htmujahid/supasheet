import { createFileRoute } from "@tanstack/react-router"

import { BellIcon } from "lucide-react"

import { DefaultHeader } from "#/components/layouts/default-header"

export const Route = createFileRoute("/core/notifications/")({
  head: () => ({ meta: [{ title: "Notifications | Supasheet" }] }),
  component: NotificationsPage,
})

function NotificationsPage() {
  return (
    <>
      <DefaultHeader breadcrumbs={[{ title: "Notifications" }]} />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
        <div className="flex size-16 items-center justify-center rounded-full border bg-muted">
          <BellIcon className="size-7 opacity-40" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-base font-medium text-foreground">Coming Soon</p>
          <p className="text-sm">
            Notifications will be available in a future update.
          </p>
        </div>
      </div>
    </>
  )
}
