import { CircleCheckIcon, CircleXIcon } from "lucide-react";

export function BooleanCell({
  value
}: {
  value: string
}) {
  if (value === undefined || value === null) {
    return null;
  }
  if (value) {
    return (
      <div className="flex gap-2 items-center">
        <CircleCheckIcon className="size-4 text-foreground" /> Yes
      </div>
    )
  }
  return (
    <div className="flex gap-2 items-center">
      <CircleXIcon className="size-4 text-muted-foreground" /> No
    </div>
  )
}