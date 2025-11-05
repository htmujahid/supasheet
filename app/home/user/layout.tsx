import {
  ShieldUserIcon,
  UserCogIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { SidebarInset } from "@/components/ui/sidebar";
import { UserSidebar } from "@/features/user/components/user-sidebar";
import { loadAccountPermissions } from "@/features/user/lib/loaders";

export default async function HomeUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const permissions = await loadAccountPermissions();

  const items = [
    {
      // name, profile picture, danger zone
      name: "Profile",
      href: "/home/user/profile",
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

  if (permissions.canSelect) {
    items.push({
      name: "Accounts",
      href: "/home/user/accounts",
      icon: <UsersIcon />,
    });
  }

  return (
    <>
      <UserSidebar items={items} />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
