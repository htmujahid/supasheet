import React from "react";

import { GripVertical, Plus, SquarePenIcon, XIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { If } from "@/components/makerkit/if";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
} from "@/components/ui/sortable";

import { AllFields } from "../../fields/all-fields";
import { ColumnMetadata } from "../../fields/types";

type ArrayFormValues = {
  items: { value: unknown }[];
};

interface DataGridArrayEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue: unknown[] | null;
  columnMetadata: ColumnMetadata;
  onSave: (value: unknown[] | null | "") => void;
  onCancel: () => void;
}

export function DataGridArrayEditSheet({
  open,
  onOpenChange,
  initialValue,
  columnMetadata,
  onSave,
  onCancel,
}: DataGridArrayEditSheetProps) {
  const form = useForm<ArrayFormValues>({
    defaultValues: {
      items: initialValue?.map((v) => ({ value: v })) ?? [],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [isNull, setIsNull] = React.useState(initialValue === null);
  const [isDefault, setIsDefault] = React.useState(false);

  // Reset form when sheet opens with new initial value
  React.useEffect(() => {
    if (open) {
      form.reset({
        items: initialValue?.map((v) => ({ value: v })) ?? [],
      });
      setIsNull(initialValue === null);
      setIsDefault(false);
    }
  }, [open, initialValue, form]);

  const handleSave = React.useCallback(() => {
    let newValue: unknown[] | null | "";
    if (isNull) {
      newValue = null;
    } else if (isDefault) {
      newValue = "";
    } else {
      const formValues = form.getValues();
      newValue = formValues.items.map((item) => item.value);
    }
    onSave(newValue);
  }, [form, isNull, isDefault, onSave]);

  const handleCancel = React.useCallback(() => {
    form.reset({
      items: initialValue?.map((v) => ({ value: v })) ?? [],
    });
    setIsNull(initialValue === null);
    setIsDefault(false);
    onCancel();
  }, [form, initialValue, onCancel]);

  const handleSetNull = React.useCallback(() => {
    fieldArray.remove();
    setIsNull(true);
    setIsDefault(false);
  }, [fieldArray]);

  const handleSetEmptyArray = React.useCallback(() => {
    fieldArray.remove();
    setIsNull(false);
    setIsDefault(false);
  }, [fieldArray]);

  const handleSetDefault = React.useCallback(() => {
    fieldArray.remove();
    setIsNull(false);
    setIsDefault(true);
  }, [fieldArray]);

  const handleAddItem = React.useCallback(() => {
    fieldArray.append({ value: "" });
    setIsNull(false);
    setIsDefault(false);
  }, [fieldArray]);

  // Get inner column metadata for array items
  const innerColumnMetadata: ColumnMetadata = React.useMemo(() => {
    return {
      ...columnMetadata,
      required: true,
      defaultValue: null,
      isArray: false,
    };
  }, [columnMetadata]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col sm:max-w-md"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          handleCancel();
        }}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <SheetHeader>
          <SheetTitle>Edit Array</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <div className="flex-1 overflow-y-auto py-4">
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
                <If condition={isNull}>
                  <p className="text-muted-foreground py-2 text-center text-sm">
                    Items set to null
                  </p>
                </If>
                <If
                  condition={
                    fieldArray.fields?.length === 0 && !isNull && !isDefault
                  }
                >
                  <p className="text-muted-foreground py-2 text-center text-sm">
                    Empty array []
                  </p>
                </If>
                <If condition={isDefault && columnMetadata?.defaultValue}>
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
                          name={`items.${index}.value`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <ButtonGroup className="flex w-full gap-2">
                                <SortableItemHandle asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8"
                                  >
                                    <GripVertical className="h-4 w-4" />
                                  </Button>
                                </SortableItemHandle>
                                <ButtonGroup className="flex-1">
                                  <FormControl className="w-full">
                                    <AllFields
                                      field={inputField as never}
                                      columnMetadata={innerColumnMetadata}
                                    />
                                  </FormControl>
                                </ButtonGroup>
                                <ButtonGroup>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => fieldArray.remove(index)}
                                  >
                                    <XIcon className="size-4" />
                                  </Button>
                                </ButtonGroup>
                              </ButtonGroup>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </SortableItem>
                    ))}
                  </div>
                </SortableContent>
                <ButtonGroup className="flex w-full gap-2">
                  <ButtonGroup className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddItem}
                      className="flex-1"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <SquarePenIcon size={16} aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <If condition={!columnMetadata?.required}>
                          <DropdownMenuItem onClick={handleSetNull}>
                            Set null
                          </DropdownMenuItem>
                        </If>
                        <DropdownMenuItem onClick={handleSetEmptyArray}>
                          Set empty array
                        </DropdownMenuItem>
                        <If condition={columnMetadata?.defaultValue}>
                          <DropdownMenuItem onClick={handleSetDefault}>
                            Set default value
                          </DropdownMenuItem>
                        </If>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </ButtonGroup>
                </ButtonGroup>
              </div>
            </Sortable>
          </div>
        </Form>

        <SheetFooter className="flex-row gap-2">
          <SheetClose asChild>
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
          </SheetClose>
          <Button onClick={handleSave} className="flex-1">
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
