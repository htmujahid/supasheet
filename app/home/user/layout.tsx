import {
  ShieldUserIcon,
  UserCogIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";

import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar } from "@/features/users/components/user-sidebar";

const items = [
  {
    // name, profile picture, danger zone
    name: "Accounts",
    href: "/home/user/accounts",
    icon: <UserIcon />,
  },
  {
    // email, identities (google, github, etc)
    name: "Identities",
    href: "/home/user/identities",
    icon: <UserPlusIcon />,
  },
  {
    // password, mfa
    name: "Security",
    href: "/home/user/security",
    icon: <ShieldUserIcon />,
  },
  {
    // roles & permissions
    name: "Roles & Permissions",
    href: "/home/user/roles-permissions",
    icon: <UserCogIcon />,
  },
];

export default async function HomeUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PrimarySidebar>
        <UserSidebar items={items} />
      </PrimarySidebar>
      <SidebarInset>
        <div className="w-full flex-1">
          <header className="flex h-12 shrink-0 items-center gap-2 px-4">
            <div className="flex flex-1 items-center gap-2">
              <SidebarTrigger />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:!h-4"
              />
              <AppBreadcrumbs />
            </div>
          </header>
          <div className="mx-auto max-w-3xl px-4">{children}</div>
        </div>
      </SidebarInset>
    </>
  );
}
