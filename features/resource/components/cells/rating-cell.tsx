import { Rating, RatingItem } from "@/components/ui/rating";

export function RatingCell({ value }: { value: number | null }) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-nowrap items-center gap-1">
      <Rating value={value} onValueChange={() => {}} step={0.5} readOnly>
        {Array.from({ length: 5 }, (_, i) => (
          <RatingItem key={i} />
        ))}
      </Rating>
    </div>
  );
}
