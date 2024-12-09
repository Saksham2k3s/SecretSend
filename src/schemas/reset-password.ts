import { z } from "zod";


export const resetPass = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(5, "Email must be at least 5 characters long")
  });