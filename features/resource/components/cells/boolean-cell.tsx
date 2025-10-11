import { CircleCheckIcon, CircleXIcon } from "lucide-react";

export function BooleanCell({ value }: { value: string }) {
  if (value === undefined || value === null) {
    return null;
  }
  if (value) {
    return (
      <div className="flex items-center gap-2">
        <CircleCheckIcon className="text-foreground size-4" /> Yes
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <CircleXIcon className="text-muted-foreground size-4" /> No
    </div>
  );
}
