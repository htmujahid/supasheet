import { useState } from "react";

import { If } from "@/components/makerkit/if";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Relationship } from "@/lib/database-meta.types";

import { ForeignTableSheet } from "../sheet-table/foreign-table-sheet";
import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";
import { ButtonGroup } from "@/components/ui/button-group";

export function ForeignKeyField({
  field,
  columnInput,
  relationship,
}: FieldProps & {
  relationship: Relationship;
}) {
  const [open, setOpen] = useState(false);

  return (
    <ButtonGroup className="w-full">
      <ButtonGroup className="w-full">
        <Input
          {...field}
          value={field.value as string}
          disabled={columnInput.disabled}
          placeholder={
            field.value === "" && columnInput.defaultValue
              ? "DEFAULT VALUE"
              : field.value === null
                ? "NULL"
                : "EMPTY"
          }
        />
      </ButtonGroup>
      <FieldOptionDropdown
        columnInput={columnInput}
        setValue={(value) => {
          field.onChange(value);
        }}
      >
        <DropdownMenuItem onClick={() => setOpen(true)}>
          Select Record
        </DropdownMenuItem>
      </FieldOptionDropdown>
      <If condition={open}>
        <ForeignTableSheet
          open={open}
          onOpenChange={setOpen}
          relationship={relationship}
          setRecord={(record) => {
            field.onChange(record[relationship.target_column_name]);
            setOpen(false);
          }}
        />
      </If>
    </ButtonGroup>
  );
}
