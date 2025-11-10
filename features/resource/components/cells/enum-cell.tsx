import { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EnumMetadata } from "@/lib/database-meta.types";

import { ColumnMetadata } from "../fields/types";

function LucideIconComponent({
  iconName,
}: {
  iconName: keyof typeof LucideIcons;
}) {
  const Icon = LucideIcons[iconName] as LucideIcon;

  return <Icon className="size-4 shrink-0 me-1" />;
}

export function EnumCell({
  value,
  columnMetadata
}: {
  value: string | null;
  columnMetadata: ColumnMetadata;
}) {
  if (!value) {
    return null;
  }

  const enumMeta = JSON.parse(columnMetadata.comment ?? "{}") as EnumMetadata;

  if (enumMeta?.enums && enumMeta.enums[value]) {
    const { icon, variant } = enumMeta.enums[value];
    return (
      <Badge variant={variant ?? "secondary"}>
        {icon && <LucideIconComponent iconName={icon as keyof typeof LucideIcons} />}
        {value}
      </Badge>
    );
  }

  return <Badge variant={"secondary"}>{value}</Badge>;
}
