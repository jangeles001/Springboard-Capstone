import { z } from "zod";

const userSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  height: z
    .string()
    .min(4, { message: "Please enter a valid height! ex. 5'8" }),
  age: z
    .number()
    .int()
    .nonnegative()
    .min(18, { message: "Must be at least 18 to register!" }),
  weight: z
    .number()
    .int()
    .positive()
    .min(70, { message: "Weight is required!" }),
  username: z.string().min(4, { message: "Username is required!" }),
  email: z.string().min(6, { message: "Email is required!" }),
});

function validate(schema) {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (err) {
      3;
      return res.status(400).json({
        error: "Validation failed",
        details: err.errors.map((e) => e.message),
      });
    }
  };
}

export default validate;
