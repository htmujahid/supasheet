import { Badge, badgeVariants } from "@/components/ui/badge";

import { ColumnMetadata } from "../fields/types";

export function EnumCell({ value }: { value: string | null }) {
  if (!value) {
    return null;
  }

  return <Badge variant={"secondary"}>{value}</Badge>;
}
