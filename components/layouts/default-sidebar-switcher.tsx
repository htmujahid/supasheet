"use client";

import Link from "next/link";

import { ChevronDown, ProportionsIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { formatTitle } from "@/lib/format";

import { Skeleton } from "../ui/skeleton";

export function DefaultSidebarSwitcher({
  schemas,
  activeSchema,
}: {
  schemas: {
    schema: string;
  }[];
  activeSchema?: string;
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5">
              {activeSchema ? (
                <>
                  <div className="bg-primary text-primary-foreground flex aspect-square size-5 items-center justify-center rounded">
                    <ProportionsIcon className="size-4" />
                  </div>

                  <span className="truncate font-medium">
                    {formatTitle(activeSchema)}
                  </span>
                  <ChevronDown className="opacity-50" />
                </>
              ) : (
                <Skeleton className="h-6 w-48" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Module
            </DropdownMenuLabel>
            {schemas.map((schema) => (
              <Link key={schema.schema} href={`/home/${schema.schema}`}>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-xs border">
                    <ProportionsIcon className="size-4 shrink-0" />
                  </div>
                  {formatTitle(schema.schema)}
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
