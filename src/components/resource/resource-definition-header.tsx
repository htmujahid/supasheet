import { Badge } from "#/components/ui/badge"

import { DynamicIcon } from "./resource-definition-utils"

interface ResourceDefinitionHeaderProps {
  name: string
  description?: string
  icon?: string
  recordCount?: number | null
}

export function ResourceDefinitionHeader({
  name,
  description,
  icon,
  recordCount,
}: ResourceDefinitionHeaderProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2">
        <DynamicIcon
          iconName={icon}
          className="size-5 shrink-0 text-muted-foreground"
        />
        <h2 className="text-base font-medium">{name}</h2>
        {recordCount != null && recordCount > 0 && (
          <Badge variant="secondary">
            {recordCount.toLocaleString()} record
            {recordCount === 1 ? "" : "s"}
          </Badge>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </section>
  )
}
