import { z } from "zod";

const SignupSchema = z
  .object({
    name: z.string().min(1, { message: "Full name is required" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Invalid Email address"),
    password: z
      .string()
      .min(1, { message: "password is required" })
      .min(8, { message: "password must be at least 8 characters" })
      .max(50, { message: "password must be less than 50 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
    method: z.string(),
    terms: z
      .boolean()
      .refine((value) => value === true, {
        message: "You must agree to the terms and conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const signinSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid Email address"),
  password: z
    .string()
    .min(1, { message: "password is required" })
    .min(8, { message: "password must be at least 8 characters" }),
  method: z.string(),
});

export type SignupFormInputs = z.infer<typeof SignupSchema>;
export type SigninFormInputs = z.infer<typeof signinSchema>;

export { SignupSchema, signinSchema };
