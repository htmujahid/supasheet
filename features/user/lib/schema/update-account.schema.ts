import { z } from "zod";

export const UpdateAccountSchema = z.object({
  email: z.string().email().optional(),
  email_confirm: z.boolean().optional(),
  phone: z.string().optional(),
  phone_confirm: z.boolean().optional(),
  password: z.string().optional(),
  user_roles: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.password) {
    return data.password.length >= 6;
  }
  return true;
})
export type UpdateAccountFormData = z.infer<typeof UpdateAccountSchema>;
