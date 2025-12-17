import { z } from "zod";

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
  height: z
    .string({
      required_error: "Height is required!",
    })
    .min(1, "Height is required!")
    .regex(/^\d+'(0?\d|1[01])"$/, {
      message: "Height must be in the format ex. 5'11\"!",
    }),
  age: z
    .number({
      required_error: "Age is required!",
      invalid_type_error: "Age must be a number!",
    })
    .min(18, "Must be at least 18!"),
  weight: z
    .number({
      required_error: "Weight is required!",
      invalid_type_error: "Weight must be a number!",
    })
    .min(70, "Weight must be at least 70!"),
  gender: z
  .string({
    required_error: "Gender required!",
    invalid_enum_value: "Gender must be one of the provided options!"
  }),
  email: z
    .string({
      required_error: "Email is required!",
      invalid_type_error: "Email must be a string!"
    })
    .email("Invalid email format!"),
  promoConsent: z.boolean({
    invalid_type_error: "Must be true or false!",
  }),
  agreeToTerms: z.boolean({
    required_error: "You must agree to the terms or service!",
    invalid_type_error: "Must be true or false!",
  }),
});
