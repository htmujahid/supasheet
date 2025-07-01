"use client";

import { useId, useState } from "react";

import Link from "next/link";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Table2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavResources({
  resources,
  activeResource,
}: {
  resources: {
    name: string;
    id: string;
  }[];
  activeResource?: string;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu className="overflow-y-auto">
        {resources.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild isActive={activeResource === item.id}>
              <Link href={"/home/resources/" + item.id} title={item.name}>
                <Table2 />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default function ResourcesGroup({
  groups,
  activeGroup,
  onValueChange,
}: {
  groups: string[];
  activeGroup: string;
  onValueChange: (value: string) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(activeGroup);

  return (
    <div className="">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            size="sm"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value === "All"
                ? "All Groups"
                : value && groups.includes(value)
                  ? value
                  : "Select Group"}
            </span>
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No Group found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="All"
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    onValueChange(currentValue);
                    setOpen(false);
                  }}
                >
                  All
                  {value === "All" && (
                    <CheckIcon
                      size={16}
                      className="ml-auto"
                      aria-hidden="true"
                    />
                  )}
                </CommandItem>
                {groups.map((group) => (
                  <CommandItem
                    key={group}
                    value={group}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      onValueChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    {group}
                    {value === group && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
