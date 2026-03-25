import { Link, createFileRoute } from "@tanstack/react-router"

import {
  ArrowRightIcon,
  BellIcon,
  ClipboardListIcon,
  KeyRoundIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react"

import { DefaultHeader } from "#/components/layouts/default-header"

export const Route = createFileRoute("/core/")({
  head: () => ({ meta: [{ title: "Core | Supasheet" }] }),
  component: RouteComponent,
})

const sections = [
  {
    title: "Users",
    description: "Manage user accounts, invite members, and control access.",
    url: "/core/users",
    icon: <UsersIcon className="size-5" />,
  },
  {
    title: "User Roles",
    description: "Assign roles to users to define their level of access.",
    url: "/core/user_roles",
    icon: <ShieldIcon className="size-5" />,
  },
  {
    title: "Role Permissions",
    description: "Configure what actions each role is permitted to perform.",
    url: "/core/role_permissions",
    icon: <KeyRoundIcon className="size-5" />,
  },
  {
    title: "Audit Logs",
    description: "Review a full history of actions taken across the system.",
    url: "/core/audit_logs",
    icon: <ClipboardListIcon className="size-5" />,
  },
  {
    title: "Notifications",
    description: "Stay informed with system alerts and activity updates.",
    url: "/core/notifications",
    icon: <BellIcon className="size-5" />,
  },
]

function RouteComponent() {
  return (
    <>
      <DefaultHeader breadcrumbs={[{ title: "Core" }]} />
      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.url}
              to={section.url}
              className="group rounded-xl border bg-card p-5 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground">
                    {section.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{section.title}</span>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
