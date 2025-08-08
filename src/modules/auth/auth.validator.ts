import { z } from "zod";

export const logInValidator = z.object({
  body: z.object({
    email: z.string().email({ message: "Valid email is required" }),
  }),
});

export const googleLoginValidator = z.object({
  body: z.object({
    idToken: z.string().min(1, { message: "ID Token is required" }),
  }),
})

export const sendVerificationEmailValidator = z.object({
  body: z.object({
    email: z.string().email({ message: "Valid email is required" }),
  }),
});