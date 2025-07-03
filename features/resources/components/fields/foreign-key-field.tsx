import { useState } from "react";

import { FieldPath } from "react-hook-form";

import { If } from "@/components/makerkit/if";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Relationship, TableSchema } from "@/lib/database-meta.types";

import { ForeignTableSheet } from "../sheet-table/foreign-table-sheet";
import { FieldOptionDropdown } from "./field-option-dropdown";
import { FieldProps } from "./types";

export function ForeignKeyField({
  form,
  column,
  columnInput,
  relationship,
}: FieldProps & {
  relationship: Relationship;
}) {
  const [open, setOpen] = useState(false);

  const value = form.getValues(column.name as FieldPath<TableSchema>);

  return (
    <div className="relative">
      <Input
        {...form.register(column.name as FieldPath<TableSchema>, {
          required: columnInput.required ? `${column.name} is required` : false,
          setValueAs: (value) => {
            if (value === "") {
              return undefined;
            }
            return value;
          },
        })}
        disabled={columnInput.disabled}
        placeholder={value === null ? "NULL" : "EMPTY"}
      />
      <FieldOptionDropdown
        columnInput={columnInput}
        setValue={(value) => {
          if (value === undefined) {
            form.setValue(
              column.name as FieldPath<TableSchema>,
              columnInput.defaultValue,
            );
          } else {
            form.setValue(column.name as FieldPath<TableSchema>, value);
          }
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
            form.setValue(
              column.name as FieldPath<TableSchema>,
              record[relationship.target_column_name],
            );
            setOpen(false);
          }}
        />
      </If>
    </div>
  );
}
