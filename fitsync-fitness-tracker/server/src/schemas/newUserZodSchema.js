import { z } from "zod";
import { newUserProfileZodSchema } from "./newUserProfileZodSchema.js";

export const newUserZodSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required!",
    })
    .min(1, "First name is required!"),
  lastName: z
    .string({
      required_error: " Last name is required!",
    })
    .min(1, "Last name is required!"),
  username: z
    .string({
      required_error: "Username is required!",
    })
    .min(4, "Username must be at least 4 characters!"),
  password: z
    .string({
      required_error: "Username is required!",
    })
    .min(6, "Password must be at least 6 characters!"),
  profile: newUserProfileZodSchema,
  email: z
    .string({
      required_error: "Email is required!",
      invalid_type_error: "Email must be a string!",
    })
    .email("Invalid email format!"),
  promoConsent: z.boolean({
    invalid_type_error: "Must be true or false!",
  }),
  agreeToTerms: z.boolean({
    required_error: "You must agree to the terms or service!",
    invalid_type_error: "Must be true or false!",
  }),
  reCaptchaToken: z.string({
    required_error: "Please complete the reCAPTCHA verification.",
    invalid_type_error: "Token must be a string!",
  }),
});
