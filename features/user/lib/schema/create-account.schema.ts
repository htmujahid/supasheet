import { z } from "zod";

export const CreateAccountSchema = z
  .object({
    id: z.string().uuid().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    email_confirm: z.boolean().optional(),
    phone: z.string().optional(),
    phone_confirm: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // At least one of email or phone must be provided
      return !!data.email || !!data.phone;
    },
    {
      message: "Either email or phone must be provided",
      path: ["email"],
    },
  )
  .refine(
    (data) => {
      // If email is provided and not confirmed, password is required
      if (data.email && !data.email_confirm) {
        return !!data.password;
      }
      return true;
    },
    {
      message: "Password is required when email is not auto-confirmed",
      path: ["password"],
    },
  );

export type CreateAccountFormData = z.infer<typeof CreateAccountSchema>;
