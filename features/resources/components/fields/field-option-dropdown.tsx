import { SquarePenIcon } from "lucide-react";

import { If } from "@/components/makerkit/if";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnInput } from "./types";

export function FieldOptionDropdown({
  columnInput,
  setValue,
  children,
}: {
  columnInput: ColumnInput;
  setValue: (value: string | null | undefined) => void;
  children?: React.ReactNode;
}) {
  if (!children && columnInput.required && !columnInput.defaultValue) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-background text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute end-2.5 top-2.5 flex w-fit items-center justify-center rounded-xs transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Subscribe"
          type="button"
        >
          <SquarePenIcon size={16} aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <If condition={!columnInput.required}>
          <DropdownMenuItem
            onClick={() => {
              setValue(null);
            }}
          >
            Set Null
          </DropdownMenuItem>
        </If>
        <If condition={columnInput.defaultValue}>
          <DropdownMenuItem
            onClick={() => {
              setValue(undefined);
            }}
          >
            Set Default
          </DropdownMenuItem>
        </If>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
