import { memo } from "react";

import { ColumnMetadata } from "../fields/types";
import { AvatarCell } from "./avatar-cell";
import { BooleanCell } from "./boolean-cell";
import { ColorCell } from "./color-cell";
import { DurationCell } from "./duration-cell";
import { EnumCell } from "./enum-cell";
import { FileCell } from "./file-cell";
import { PercentageCell } from "./percentage-cell";
import { RatingCell } from "./rating-cell";

export const AllCells = memo(function AllCells({
  columnMetadata,
  value,
}: {
  columnMetadata: ColumnMetadata;
  value: unknown;
}) {
  switch (columnMetadata.variant) {
    case "boolean":
      return <BooleanCell value={value as string} />;
    case "color":
      return <ColorCell value={value as string} />;
    case "percentage":
      return <PercentageCell value={value as number} />;
    case "duration":
      return <DurationCell value={value as string} />;
    case "file":
      return <FileCell value={value as string[]} />;
    case "avatar":
      return <AvatarCell value={value as string | null} />;
    case "rating":
      return <RatingCell value={value as number | null} />;
    case "select":
      return (
        <EnumCell value={value as string} columnMetadata={columnMetadata} />
      );
    case "money":
      return value ? `${value}` : "";
    case "json":
      return (
        <pre className="truncate">
          {value ? JSON.stringify(value, null, 2) : ""}
        </pre>
      );
    case "date":
      return value ? new Date(value as string).toLocaleDateString() : "";
    case "datetime":
      return value ? new Date(value as string).toLocaleString() : "";
    case "time":
      return value
        ? new Date(`1970-01-01T${value as string}Z`).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";
    default:
      return value?.toString();
  }
});
