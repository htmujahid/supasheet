import { z } from "zod";

export const eventSchema = z
  .object({
    user: z.string(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    start_date: z.date({ required_error: "Start date is required" }),
    startTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: "Start time is required" }),
    end_date: z.date({ required_error: "End date is required" }),
    endTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: "End time is required" }),
  })
  .refine(
    data => {
      const startDateTime = new Date(data.start_date);
      startDateTime.setHours(data.startTime.hour, data.startTime.minute, 0, 0);

      const endDateTime = new Date(data.end_date);
      endDateTime.setHours(data.endTime.hour, data.endTime.minute, 0, 0);

      return startDateTime < endDateTime;
    },
    {
      message: "Start date cannot be after end date",
      path: ["start_date"],
    }
  );

export type TEventFormData = z.infer<typeof eventSchema>;
