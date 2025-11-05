"use client";

import { useMemo } from "react";

import Link from "next/link";

import type { User } from "@supabase/supabase-js";

import { ChevronsUpDown, Home, LogOut, UserIcon } from "lucide-react";

import { If } from "@/components/makerkit/if";
import { SubMenuModeToggle } from "@/components/makerkit/mode-toggle";
import { Trans } from "@/components/makerkit/trans";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

import { usePersonalAccountData } from "../lib/hooks/use-personal-account-data";

export function PersonalAccountDropdown({
  user,
  signOutRequested,
  paths,
  features,
  account,
}: {
  user: User;

  account?: {
    id: string | null;
    name: string | null;
    picture_url: string | null;
  };

  signOutRequested: () => unknown;

  paths: {
    home: string;
    account: string;
  };

  features: {
    enableThemeToggle: boolean;
  };
}) {
  const personalAccountData = usePersonalAccountData(user?.id, account);

  const signedInAsLabel = useMemo(() => {
    const email = user?.email ?? undefined;
    const phone = user?.phone ?? undefined;

    return email ?? phone;
  }, [user]);

  const displayName =
    personalAccountData?.data?.name ?? account?.name ?? user?.email ?? "";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              data-test="account-dropdown-trigger"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={personalAccountData?.data?.picture_url ?? ""}
                  alt={displayName}
                />
                <AvatarFallback className="rounded-lg">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {displayName ? (
                  <span
                    className="truncate font-medium"
                    data-test="account-dropdown-display-name"
                  >
                    {displayName}
                  </span>
                ) : (
                  <Skeleton className="h-4 w-24" />
                )}
                {signedInAsLabel ? (
                  <span
                    className="truncate text-xs"
                    data-test="account-dropdown-email"
                  >
                    {signedInAsLabel}
                  </span>
                ) : (
                  <Skeleton className="mt-1 h-3 w-32" />
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={"bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={personalAccountData?.data?.picture_url ?? ""}
                    alt={displayName}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{signedInAsLabel}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={paths.home}>
                  <Home />
                  <Trans i18nKey="common:routes.home" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={paths.account}>
                  <UserIcon />
                  <Trans i18nKey="common:routes.account" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <If condition={features.enableThemeToggle}>
              <DropdownMenuSeparator />
              <SubMenuModeToggle />
            </If>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              data-test="account-dropdown-sign-out"
              onClick={signOutRequested}
            >
              <LogOut />
              <Trans i18nKey="auth:signOut" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
