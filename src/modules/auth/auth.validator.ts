import { z } from "zod";

export const logInValidator = z.object({
  body: z.object({
    email: z.string().email({ message: "Valid email is required" }),
    code: z.string().min(6).max(6).regex(/^\d{6}$/, { message: "Valid verification code is required" }),

  }),
});

export const googleLoginValidator = z.object({
  body: z.object({
    email: z.string().min(1, { message: "Email is required" })
  }),
})

export const sendVerificationEmailValidator = z.object({
  body: z.object({
    email: z.string().email({ message: "Valid email is required" }),
  }),
});