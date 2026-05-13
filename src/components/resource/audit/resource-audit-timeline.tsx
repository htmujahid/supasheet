import { useState } from "react"

import { format, formatDistanceToNow } from "date-fns"
import { CheckCircle, PlusCircle, Trash2, XCircle } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar"
import { Badge } from "#/components/ui/badge"
import { ScrollArea } from "#/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "#/components/ui/sheet"
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "#/components/ui/timeline"
import type { ResourceAuditLog } from "#/lib/supabase/data/resource"

import { ResourceAuditLogDetail, opVariant } from "./resource-audit-log-detail"

function opIcon(op: string) {
  if (op === "INSERT") return <PlusCircle className="h-3 w-3" />
  if (op === "DELETE") return <Trash2 className="h-3 w-3" />
  return null
}

function opDotClass(op: string) {
  if (op === "INSERT") return "border-green-500"
  if (op === "DELETE") return "border-destructive"
  return ""
}

function userInitials(name: string | null) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function AuditTimelineItem({
  entry,
  onClick,
}: {
  entry: ResourceAuditLog
  onClick: () => void
}) {
  const description = () => {
    if (entry.operation === "INSERT") return "Record created"
    if (entry.operation === "DELETE") return "Record deleted"
    if (entry.changed_fields && entry.changed_fields.length > 0) {
      return `Updated: ${entry.changed_fields.slice(0, 3).join(", ")}${entry.changed_fields.length > 3 ? ` +${entry.changed_fields.length - 3} more` : ""}`
    }
    return "Record updated"
  }

  return (
    <TimelineItem>
      <TimelineDot className={opDotClass(entry.operation)} />
      <TimelineConnector />
      <TimelineContent>
        <button
          type="button"
          onClick={onClick}
          className="group w-full rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <TimelineHeader>
            <TimelineTime dateTime={entry.created_at}>
              {formatDistanceToNow(new Date(entry.created_at), {
                addSuffix: true,
              })}
              <span className="ml-1 text-muted-foreground/60">
                · {format(new Date(entry.created_at), "MMM d, HH:mm")}
              </span>
            </TimelineTime>
            <div className="flex items-center gap-2">
              <TimelineTitle className="flex items-center gap-1.5">
                <Badge
                  variant={opVariant(entry.operation)}
                  className="gap-1 px-1.5 py-0 text-xs"
                >
                  {opIcon(entry.operation)}
                  {entry.operation}
                </Badge>
                {entry.is_error ? (
                  <XCircle className="h-3.5 w-3.5 text-destructive" />
                ) : (
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                )}
              </TimelineTitle>
            </div>
          </TimelineHeader>
          <TimelineDescription className="mt-1.5 flex items-center gap-2">
            <Avatar className="h-4 w-4 shrink-0">
              <AvatarImage src={entry.created_by_picture_url ?? undefined} />
              <AvatarFallback className="text-[8px]">
                {userInitials(entry.created_by_name)}
              </AvatarFallback>
            </Avatar>
            <span>
              {entry.created_by_name ?? entry.created_by ?? "System"}
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span>{description()}</span>
          </TimelineDescription>
        </button>
      </TimelineContent>
    </TimelineItem>
  )
}

export function ResourceAuditTimeline({ logs }: { logs: ResourceAuditLog[] }) {
  const [selected, setSelected] = useState<ResourceAuditLog | null>(null)

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium">No audit logs</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Changes to this record will appear here.
        </p>
      </div>
    )
  }

  return (
    <>
      <Timeline className="px-1 py-2">
        {logs.map((entry) => (
          <AuditTimelineItem
            key={entry.id}
            entry={entry}
            onClick={() => setSelected(entry)}
          />
        ))}
      </Timeline>

      <Sheet open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null) }}>
        <SheetContent className="w-full sm:max-w-lg overflow-hidden p-0">
          <SheetHeader className="p-4 pb-2">
            <SheetTitle>Audit Log Entry</SheetTitle>
            <SheetDescription>
              {selected && format(new Date(selected.created_at), "PPpp")}
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-5rem)] px-4 pb-4">
            {selected && <ResourceAuditLogDetail data={selected} />}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}
