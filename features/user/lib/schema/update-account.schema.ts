import { z } from "zod";

export const UpdateAccountSchema = z.object({
  email: z.string().email().optional(),
  email_confirm: z.boolean().optional(),
  phone: z.string().optional(),
  phone_confirm: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

export type UpdateAccountFormData = z.infer<typeof UpdateAccountSchema>;
