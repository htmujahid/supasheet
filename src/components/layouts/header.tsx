import { Link, useNavigate } from "@tanstack/react-router"

import { useQueryClient } from "@tanstack/react-query"

import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon,
  TableIcon,
  UserIcon,
} from "lucide-react"

import { useTheme } from "#/components/theme-provider"
import type { ThemeMode } from "#/components/theme-provider"
import { Avatar, AvatarFallback } from "#/components/ui/avatar"
import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { useUser } from "#/hooks/use-user"
import { supabase } from "#/lib/supabase/client"
import { authUserQueryOptions } from "#/lib/supabase/data/auth"

const THEME_OPTIONS: {
  value: ThemeMode
  label: string
  icon: React.ReactNode
}[] = [
  { value: "light", label: "Light", icon: <SunIcon /> },
  { value: "dark", label: "Dark", icon: <MoonIcon /> },
  { value: "auto", label: "System", icon: <MonitorIcon /> },
]

export function Header() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mode, setTheme } = useTheme()
  const user = useUser()

  const initials = (user?.name ?? user?.email ?? "?").slice(0, 2).toUpperCase()

  async function handleSignOut() {
    await supabase.auth.signOut()
    queryClient.setQueryData(authUserQueryOptions.queryKey, null)
    navigate({ to: "/auth/sign-in", replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-11 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <TableIcon className="size-4" />
          <span>Supasheet</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={<Link to="/core/notifications" />}
            aria-label="Notifications"
          >
            <BellIcon className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Avatar size="sm">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {/* User info */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5 normal-case">
                  <span className="text-sm font-medium text-foreground">
                    {user?.name}
                  </span>
                  <span className="truncate text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Navigation */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  render={<Link to="/" />}
                >
                  <HomeIcon />
                  Home
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  render={<Link to="/account/profile" />}
                >
                  <UserIcon />
                  Profile
                </DropdownMenuItem>

                {/* Theme submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <SunMoonIcon />
                    Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-48">
                    <DropdownMenuRadioGroup
                      value={mode}
                      onValueChange={(val) => setTheme(val as ThemeMode)}
                    >
                      {THEME_OPTIONS.map(({ value, label, icon }) => (
                        <DropdownMenuRadioItem
                          key={value}
                          value={value}
                          className="cursor-pointer"
                        >
                          {icon}
                          {label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Sign out */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOutIcon />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
