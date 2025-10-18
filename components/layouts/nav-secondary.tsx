import React from "react"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { PersonalAccountDropdown } from "@/features/user/components/personal-account-dropdown"
import { useSignOut } from "@/lib/supabase/hooks/use-sign-out"
import { usePathname } from "next/navigation"
import { useUser } from "@/lib/supabase/hooks/use-user"
import featuresFlagConfig from "@/config/feature-flags.config"
import pathsConfig from "@/config/paths.config"

const paths = {
  home: pathsConfig.app.home,
  account: pathsConfig.app.account,
};

const features = {
  enableThemeToggle: featuresFlagConfig.enableThemeToggle,
};

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    badge?: React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const { data: userData } = useUser();
  const signOut = useSignOut();

  return (
    <>
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <PersonalAccountDropdown
        paths={paths}
        features={features}
        user={userData!}
        account={{ id: "", name: "", picture_url: "" }}
        signOutRequested={() => signOut.mutateAsync()}
      />
    </>
  )
}
