"use client";

import { parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { AlertTriangle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDisclosure } from "@/hooks/use-disclosure";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormLabel, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogHeader, DialogClose, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { eventSchema } from "@/interfaces/calendar/lib/schemas";

import type { Event } from "@/interfaces/calendar/lib/types";
import type { TEventFormData } from "@/interfaces/calendar/lib/schemas";

interface IProps {
  children: React.ReactNode;
  event: Event;
}

export function EditEventDialog({ children, event }: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      start_date: parseISO(event.start_date),
      startTime: { hour: parseISO(event.start_date).getHours(), minute: parseISO(event.start_date).getMinutes() },
      end_date: parseISO(event.end_date),
      endTime: { hour: parseISO(event.end_date).getHours(), minute: parseISO(event.end_date).getMinutes() },
    },
  });

  const onSubmit = (values: TEventFormData) => {
    const startDateTime = new Date(values.start_date);
    startDateTime.setHours(values.startTime.hour, values.startTime.minute);

    const endDateTime = new Date(values.end_date);
    endDateTime.setHours(values.endTime.hour, values.endTime.minute);

    // updateEvent({
    //   ...event,
    //   title: values.title,
    //   description: values.description,
    //   start_date: startDateTime.toISOString(),
    //   end_date: endDateTime.toISOString(),
    // });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            <AlertTriangle className="mr-1 inline-block size-4 text-yellow-500" />
            This form only updates the current event state locally for demonstration purposes. If you move an event after editing, some inconsistencies may
            occur. In a real application, you should submit this form to a backend API to persist the changes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="event-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>

                  <FormControl>
                    <Input id="title" placeholder="Enter a title" data-invalid={fieldState.invalid} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>

                  <FormControl>
                    <Textarea {...field} value={field.value} data-invalid={fieldState.invalid} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>

          <Button form="event-form" type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
