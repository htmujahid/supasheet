"use client";

import { useMemo } from "react";

import { Computer, Moon, Sun, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const MODES = ["light", "dark", "system"];

export function ModeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  const Items = useMemo(() => {
    return MODES.map((mode) => {
      const isSelected = theme === mode;

      return (
        <DropdownMenuItem
          className={cn("space-x-2", {
            "bg-muted": isSelected,
          })}
          key={mode}
          onClick={() => {
            setTheme(mode);
            setCookeTheme(mode);
          }}
        >
          <Icon theme={mode} />

          <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
        </DropdownMenuItem>
      );
    });
  }, [setTheme, theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Sun className="h-[0.9rem] w-[0.9rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[0.9rem] w-[0.9rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">{Items}</DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SubMenuModeToggle() {
  const { setTheme, theme } = useTheme();

  const MenuItems = useMemo(
    () =>
      MODES.map((mode) => {
        const isSelected = theme === mode;

        return (
          <DropdownMenuItem
            className={cn("flex cursor-pointer items-center space-x-2", {
              "bg-muted": isSelected,
            })}
            key={mode}
            onClick={() => {
              setTheme(mode);
              setCookeTheme(mode);
            }}
          >
            <Icon theme={mode} />

            <span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
          </DropdownMenuItem>
        );
      }),
    [setTheme, theme],
  );

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger
          className={
            "hidden w-full items-center justify-between gap-x-2 lg:flex"
          }
        >
          <span className={"flex space-x-2"}>
            <SunMoonIcon size={16} className="opacity-60" />

            <span>Theme</span>
          </span>
        </DropdownMenuSubTrigger>

        <DropdownMenuSubContent className="min-w-54">
          {MenuItems}
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <div className={"lg:hidden"}>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>

        {MenuItems}
      </div>
    </>
  );
}

function setCookeTheme(theme: string) {
  document.cookie = `theme=${theme}; path=/; max-age=31536000`;
}

function Icon({ theme }: { theme: string | undefined }) {
  switch (theme) {
    case "light":
      return <Sun className="h-4" />;
    case "dark":
      return <Moon className="h-4" />;
    case "system":
      return <Computer className="h-4" />;
  }
}
