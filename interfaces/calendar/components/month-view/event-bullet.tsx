import { cn } from "@/lib/utils";

export function EventBullet({ className }: { className: string }) {
  return <div className={cn("size-2 rounded-full bg-neutral-600 dark:bg-neutral-500", className)} />;
}
