import { SquarePenIcon } from "lucide-react";

import { If } from "@/components/makerkit/if";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColumnMetadata } from "./types";

export function FieldOptionDropdown({
  columnMetadata,
  setValue,
  children,
}: {
  columnMetadata: ColumnMetadata;
  setValue: (value: string | null | undefined) => void;
  children?: React.ReactNode;
}) {
  if (!children && columnMetadata.required && !columnMetadata.defaultValue) {
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
          <If condition={!columnMetadata.required}>
            <DropdownMenuItem
              onClick={() => {
                setValue(null);
              }}
            >
              Set Null
            </DropdownMenuItem>
          </If>
          <If condition={columnMetadata.defaultValue}>
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
