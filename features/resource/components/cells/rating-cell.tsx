import { StarIcon } from "lucide-react";

export function RatingCell({ value }: { value: number | null }) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-nowrap items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`h-4 w-4 shrink-0 ${i < value ? "fill-foreground text-foreground" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}
