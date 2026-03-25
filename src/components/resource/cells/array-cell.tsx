import { memo } from "react"

import { Badge } from "#/components/ui/badge"

export const ArrayCell = memo(function ({ value }: { value: any[] | null }) {
  return (
    <div className="flex gap-1">
      {value?.map((v) => (
        <Badge key={v} variant={"outline"}>
          {v.toString()}
        </Badge>
      ))}
    </div>
  )
})
