import { Badge } from "@/components/ui/badge";

export function EnumCell({ value }: { value: string | null }) {
  if (!value) {
    return null;
  }

  return <Badge variant={"secondary"}>{value}</Badge>;
}
