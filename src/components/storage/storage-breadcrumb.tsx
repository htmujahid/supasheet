import { Fragment } from "react"

import { ChevronRightIcon, HardDriveIcon } from "lucide-react"

import { Button } from "#/components/ui/button"

interface StorageBreadcrumbProps {
  bucketId: string
  path: string[]
  onNavigate: (index: number) => void
}

export function StorageBreadcrumb({
  bucketId,
  path,
  onNavigate,
}: StorageBreadcrumbProps) {
  return (
    <div className="flex min-w-0 items-center gap-1 overflow-hidden text-sm">
      <Button
        variant="ghost"
        size="sm"
        className="h-7 shrink-0 gap-1.5 px-2"
        onClick={() => onNavigate(-1)}
      >
        <HardDriveIcon className="size-3.5" />
        <span className="max-w-32 truncate">{bucketId}</span>
      </Button>
      {path.map((segment, i) => (
        <Fragment key={i}>
          <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 max-w-32 shrink-0 truncate px-2"
            onClick={() => onNavigate(i)}
          >
            {segment}
          </Button>
        </Fragment>
      ))}
    </div>
  )
}
