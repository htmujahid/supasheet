import { BooleanField } from "./boolean-field";
import { DateField } from "./date-field";
import { DatetimeField } from "./datetime-field";
import { DurationField } from "./duration-field";
import { JsonField } from "./json-field";
import { LongtextField } from "./longtext-field";
import { MoneyField } from "./money-field";
import { NumberField } from "./number-field";
import { PercentageField } from "./percentage-field";
import { RatingField } from "./rating-field";
import { RichTextField } from "./rich-text-field";
import { SelectField } from "./select-field";
import { TextField } from "./text-field";
import { TimeField } from "./time-field";
import { FieldProps } from "./types";
import { UuidField } from "./uuid-field";

export function AllFields({ field, columnMetadata }: FieldProps) {
  switch (columnMetadata.type) {
    case "uuid":
      return <UuidField field={field} columnMetadata={columnMetadata} />;
    case "money":
      return <MoneyField field={field} columnMetadata={columnMetadata} />;
    case "number":
      return <NumberField field={field} columnMetadata={columnMetadata} />;
    case "percentage":
      return <PercentageField field={field} columnMetadata={columnMetadata} />;
    case "boolean":
      return <BooleanField field={field} columnMetadata={columnMetadata} />;
    case "select":
      return <SelectField field={field} columnMetadata={columnMetadata} />;
    case "date":
      return <DateField field={field} columnMetadata={columnMetadata} />;
    case "time":
      return <TimeField field={field} columnMetadata={columnMetadata} />;
    case "datetime":
      return <DatetimeField field={field} columnMetadata={columnMetadata} />;
    case "json":
      return <JsonField field={field} columnMetadata={columnMetadata} />;
    case "longtext":
      return <LongtextField field={field} columnMetadata={columnMetadata} />;
    case "rating":
      return <RatingField field={field} columnMetadata={columnMetadata} />;
    case "duration":
      return <DurationField field={field} columnMetadata={columnMetadata} />;
    case "rich_text":
      return <RichTextField field={field} columnMetadata={columnMetadata} />;
    case "color":
    case "email":
    case "tel":
    case "text":
    case "url":
    default:
      return <TextField field={field} columnMetadata={columnMetadata} />;
  }
}
