import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Valid email required");
const fullName = z.string().trim().min(2, "Full name is required").max(150);
const password = z.string().min(8, "Password must be at least 8 characters");

export const userCreateSchema = z.object({
  email,
  password,
  fullName,
});

export const userUpdateSchema = userCreateSchema
  .partial()
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one field is required",
  });

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
