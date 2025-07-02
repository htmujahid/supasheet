import { useState } from "react";

import { SquarePenIcon } from "lucide-react";
import { FieldPath } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Relationship, TableSchema } from "@/lib/database-meta.types";

import { ForeignTableSheet } from "../sheet-table/foreign-table-sheet";
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

  return (
    <div className="relative">
      <Input
        {...form.register(column.name as FieldPath<TableSchema>, {
          required: columnInput.required ? `${column.name} is required` : false,
        })}
        disabled={columnInput.disabled}
      />
      <button
        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Subscribe"
        type="button"
        onClick={() => setOpen(true)}
      >
        <SquarePenIcon size={16} aria-hidden="true" />
      </button>
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
    </div>
  );
}
