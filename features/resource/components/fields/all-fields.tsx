import { BooleanField } from "./boolean-field";
import { DateField } from "./date-field";
import { DatetimeField } from "./datetime-field";
import { JsonField } from "./json-field";
import { NumberField } from "./number-field";
import { SelectField } from "./select-field";
import { TextField } from "./text-field";
import { TimeField } from "./time-field";
import { FieldProps } from "./types";
import { UuidField } from "./uuid-field";

export function AllFields({ field, columnInput }: FieldProps) {
  if (columnInput.variant === "uuid") {
    return <UuidField field={field} columnInput={columnInput} />;
  }
  if (columnInput.variant === "text") {
    return <TextField field={field} columnInput={columnInput} />;
  }
  if (columnInput.variant === "number") {
    return <NumberField field={field} columnInput={columnInput} />;
  }
  if (columnInput.variant === "boolean") {
    return <BooleanField field={field} columnInput={columnInput} />;
  }
  if (columnInput.variant === "select") {
    return <SelectField field={field} columnInput={columnInput} />;
  }
  if (columnInput.variant === "date") {
    return <DateField field={field} columnInput={columnInput} />;
  }
  if (columnInput.variant === "time") {
    return <TimeField field={field} columnInput={columnInput} />;
  }
  if (columnInput.variant === "datetime") {
    return <DatetimeField field={field} columnInput={columnInput} />;
  }
  if (columnInput.variant === "json") {
    return <JsonField field={field} columnInput={columnInput} />;
  }
}
