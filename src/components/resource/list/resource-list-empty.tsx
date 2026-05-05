import { ListIcon } from "lucide-react"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"

export function ResourceListEmpty() {
  return (
    <Empty className="min-h-100 rounded-md border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ListIcon />
        </EmptyMedia>
        <EmptyTitle>No items to display</EmptyTitle>
        <EmptyDescription>
          There are no records available at the moment.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
