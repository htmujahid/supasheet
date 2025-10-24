"use client";

import { format, parseISO } from "date-fns";
import { Calendar, Clock, Text } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EditEventDialog } from "@/interfaces/calendar/components/dialogs/edit-event-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import type { Event } from "@/interfaces/calendar/lib/types";

interface IProps {
  event: Event;
  children: React.ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const start_date = parseISO(event.start_date);
  const end_date = parseISO(event.end_date);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-sm text-muted-foreground">{format(start_date, "MMM d, yyyy h:mm a")}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">End Date</p>
                <p className="text-sm text-muted-foreground">{format(end_date, "MMM d, yyyy h:mm a")}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Text className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <EditEventDialog event={event}>
              <Button type="button" variant="outline">
                Edit
              </Button>
            </EditEventDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
