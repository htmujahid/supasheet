import { DoorClosedLockedIcon, UserIcon, UserLockIcon } from "lucide-react";

import { DefaultLayout } from "@/components/layouts/default-layout";
import { PrimaryLayout } from "@/components/layouts/primary-layout";
import { SidebarInset } from "@/components/ui/sidebar";
import { UserSidebar } from "@/features/users/components/user-sidebar";

const items = [
  {
    name: "Accounts",
    id: "accounts",
    icon: <UserIcon />,
  },
  {
    name: "User Roles",
    id: "user_roles",
    icon: <UserLockIcon />,
  },
  {
    name: "Role Permissions",
    id: "role_permissions",
    icon: <DoorClosedLockedIcon />,
  },
];

export default async function HomeUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DefaultLayout>
      <PrimaryLayout>
        <UserSidebar items={items} />
      </PrimaryLayout>
      <SidebarInset>
        <div className="w-full flex-1">{children}</div>
      </SidebarInset>
    </DefaultLayout>
  );
}
