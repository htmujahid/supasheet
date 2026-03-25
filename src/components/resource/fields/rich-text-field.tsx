import { Editor } from "#/components/blocks/editor-md/editor"
import { ButtonGroup } from "#/components/ui/button-group"
import type { FieldProps } from "#/types/fields"

import { useFieldContext } from "../form-hook"

export function RichTextField({ columnMetadata }: FieldProps) {
  const field = useFieldContext<unknown>()
  const placeholder =
    field.state.value === "" && columnMetadata.defaultValue
      ? "DEFAULT VALUE"
      : field.state.value === null
        ? "NULL"
        : "EMPTY"

  return (
    <ButtonGroup className="w-full">
      <Editor
        name={columnMetadata.label}
        value={(field.state.value as string) ?? ""}
        onChange={(v) => field.handleChange(v)}
        disabled={columnMetadata.disabled}
        placeholder={placeholder}
      />
    </ButtonGroup>
  )
}
