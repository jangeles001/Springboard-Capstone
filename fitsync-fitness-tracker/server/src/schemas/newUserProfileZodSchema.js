import { z } from "zod";

export const newUserProfileZodSchema = z.object({
  heightInches: z
    .number({
      required_error: "Height is required!",
    })
    .min(60, "Height is required!"),
  age: z
    .number({
      required_error: "Age is required!",
      invalid_type_error: "Age must be a number!",
    })
    .min(18, "Must be at least 18!"),
  weightLbs: z
    .number({
      required_error: "Weight is required!",
      invalid_type_error: "Weight must be a number!",
    })
    .min(70, "Weight must be at least 70!"),
  gender: z.string({
    required_error: "Gender required!",
    invalid_enum_value: "Gender must be one of the provided options!",
  }),
  activityLevel: z.string({
    required_error: "Activity Level is required!",
    invalid_enum_value: "Activity Level must be one of the provided options!",
  }),
  goalType: z.string({
    required_error: "Goal is required!",
    invalid_enum_value: "Goal must be one of the provided options!",
  }),
});
