import { BooleanField } from "./boolean-field";
import { DateField } from "./date-field";
import { DatetimeField } from "./datetime-field";
import { DurationField } from "./duration-field";
import { JsonField } from "./json-field";
import { LongtextField } from "./longtext-field";
import { MoneyField } from "./money-field";
import { NumberField } from "./number-field";
import { RatingField } from "./rating-field";
import { SelectField } from "./select-field";
import { TextField } from "./text-field";
import { TimeField } from "./time-field";
import { FieldProps } from "./types";
import { UuidField } from "./uuid-field";

export function AllFields({ field, columnInput }: FieldProps) {
  switch (columnInput.type) {
    case "uuid":
      return <UuidField field={field} columnInput={columnInput} />;
    case "money":
      return <MoneyField field={field} columnInput={columnInput} />;
    case "number":
    case "percentage":
      return <NumberField field={field} columnInput={columnInput} />;
    case "boolean":
      return <BooleanField field={field} columnInput={columnInput} />;
    case "select":
      return <SelectField field={field} columnInput={columnInput} />;
    case "date":
      return <DateField field={field} columnInput={columnInput} />;
    case "time":
      return <TimeField field={field} columnInput={columnInput} />;
    case "datetime":
      return <DatetimeField field={field} columnInput={columnInput} />;
    case "json":
      return <JsonField field={field} columnInput={columnInput} />;
    case "longtext":
      return <LongtextField field={field} columnInput={columnInput} />;
    case "rating":
      return <RatingField field={field} columnInput={columnInput} />;
    case "duration":
      return <DurationField field={field} columnInput={columnInput} />;
    case "color":
    case "email":
    case "tel":
    case "text":
    case "url":
    default:
      return <TextField field={field} columnInput={columnInput} />;
  }
}
