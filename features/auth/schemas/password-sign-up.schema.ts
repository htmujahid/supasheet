import { z } from "zod";

import { RefinedPasswordSchema } from "./password.schema";

export const PasswordSignUpSchema = z.object({
  email: z.string().email(),
  password: RefinedPasswordSchema,
});
