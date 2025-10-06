import { SquarePenIcon } from "lucide-react";

import { If } from "@/components/makerkit/if";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

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
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"} className="">
            <SquarePenIcon size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
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
                setValue("");
              }}
            >
              Set Default
            </DropdownMenuItem>
          </If>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
