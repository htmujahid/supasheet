import { z } from "zod";

export const UpdateEmailSchema = z
  .object({
    email: z.string().email(),
    repeatEmail: z.string().email(),
  })
  .refine(
    (values) => {
      return values.email === values.repeatEmail;
    },
    {
      path: ["repeatEmail"],
      message: "Emails do not match. Make sure you're using the correct email",
    },
  );
