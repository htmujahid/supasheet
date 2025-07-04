import { GripVertical, Plus, SquarePenIcon, XIcon } from "lucide-react";
import {
  type Control,
  type FieldPath,
  type UseFormReturn,
  useFieldArray,
} from "react-hook-form";

import { If } from "@/components/makerkit/if";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";
import { TableSchema } from "@/lib/database-meta.types";

import { AllFields } from "./all-fields";
import { ColumnInput, FieldProps } from "./types";

export function ArrayField({
  form,
  columnInput,
  field,
  control,
}: {
  form: UseFormReturn<TableSchema>;
  columnInput: ColumnInput;
  field: FieldProps["field"];
  control: Control<TableSchema>;
}) {
  const fieldArray = useFieldArray({
    control,
    name: field.name as never,
  });

  return (
    <Sortable
      value={fieldArray.fields}
      onDragEnd={(event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
          const oldIndex = fieldArray.fields?.findIndex(
            (field) => field.id === active.id,
          );
          const newIndex = fieldArray.fields?.findIndex(
            (field) => field.id === over.id,
          );

          fieldArray.move(oldIndex, newIndex);
        }
      }}
      orientation="vertical"
      getItemValue={(item) => item.id}
    >
      <div className="space-y-2 rounded-lg border p-2">
        <If condition={field.value === null}>
          <p className="text-muted-foreground py-2 text-center text-sm">
            Items set to null
          </p>
        </If>
        <If
          condition={
            fieldArray.fields?.length === 0 &&
            field.value !== null &&
            field.value !== ''
          }
        >
          <p className="text-muted-foreground py-2 text-center text-sm">
            Empty array []
          </p>
        </If>
        <If condition={field.value === '' && columnInput.defaultValue}>
          <p className="text-muted-foreground py-2 text-center text-sm">
            DEFAULT VALUE
          </p>
        </If>
        <SortableContent asChild>
          <div className="space-y-2">
            {fieldArray.fields?.map((f, index) => (
              <SortableItem key={f.id} value={f.id}>
                <FormField
                  key={f.id}
                  control={form.control}
                  name={`${field.name}.${index}`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <div className="flex gap-2">
                        <SortableItemHandle asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <GripVertical className="h-4 w-4" />
                          </Button>
                        </SortableItemHandle>
                        <FormControl className="w-full">
                          <AllFields
                            field={inputField}
                            columnInput={{
                              ...columnInput,
                              required: true,
                              defaultValue: null,
                            }}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => fieldArray.remove(index)}
                        >
                          <XIcon className="size-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </SortableItem>
            ))}
          </div>
        </SortableContent>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fieldArray.append("")}
            className="flex-1"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SquarePenIcon size={16} aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <If condition={!columnInput.required}>
                <DropdownMenuItem
                  onClick={() => {
                    fieldArray.remove();
                    form.setValue(field.name as FieldPath<TableSchema>, null);
                  }}
                >
                  Set null
                </DropdownMenuItem>
              </If>
              <DropdownMenuItem
                onClick={() =>
                  form.setValue(field.name as FieldPath<TableSchema>, [])
                }
              >
                Set empty array
              </DropdownMenuItem>
              <If condition={columnInput.defaultValue}>
                <DropdownMenuItem
                  onClick={() => {
                    fieldArray.remove();
                    form.setValue(field.name as FieldPath<TableSchema>, '');
                  }}
                >
                  Set default value
                </DropdownMenuItem>
              </If>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Sortable>
  );
}
