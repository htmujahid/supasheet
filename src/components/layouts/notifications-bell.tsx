import { Link } from "@tanstack/react-router"

import { useQuery } from "@tanstack/react-query"

import { BellIcon } from "lucide-react"

import { Button } from "#/components/ui/button"
import { unreadNotificationsCountQueryOptions } from "#/lib/supabase/data/core"
import { cn } from "#/lib/utils"

export function NotificationsBell({ className }: { className?: string }) {
  const { data: unreadCount = 0 } = useQuery(
    unreadNotificationsCountQueryOptions
  )

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      nativeButton={false}
      render={<Link to="/core/notifications" />}
      aria-label={
        unreadCount > 0
          ? `Notifications (${unreadCount} unread)`
          : "Notifications"
      }
      className={cn("relative", className)}
    >
      <BellIcon className="size-4" />
      {unreadCount > 0 && (
        <span className="absolute top-0.5 right-0.5 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Button>
  )
}
