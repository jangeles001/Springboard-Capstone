import { z } from "zod";

export const newUserZodSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  height: z.string().min(5, "Height is required"),
  age: z.number().min(18, "Must be at least 18"),
  weight: z.number().min(70, "Weight must be at least 70"),
  email: z.string().email("Invalid email format").min(7),
});
