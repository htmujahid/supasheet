import { Editor } from "@/components/blocks/editor-md/editor";
import { ButtonGroup } from "@/components/ui/button-group";

import type { FieldProps } from "./types";

export function RichTextField({ field, columnMetadata }: FieldProps) {
  const placeholder =
    field.value === "" && columnMetadata.defaultValue
      ? "DEFAULT VALUE"
      : field.value === null
        ? "NULL"
        : "EMPTY";

  return (
    <ButtonGroup className="w-full">
      <Editor
        name={columnMetadata.label}
        value={(field.value as string) ?? ""}
        onChange={field.onChange}
        disabled={columnMetadata.disabled}
        placeholder={placeholder}
      />
    </ButtonGroup>
  );
}
