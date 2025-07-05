"use client";

import { useId, useState } from "react";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

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
import { cn } from "@/lib/utils";

export function ResourcesGroup({
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
