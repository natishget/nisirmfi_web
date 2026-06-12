import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Valid email required");
const fullName = z.string().trim().min(2, "Full name is required").max(150);
const password = z.string().min(8, "Password must be at least 8 characters");

export const authRegisterSchema = z.object({
  fullName,
  email,
  password,
});

export const authLoginSchema = z.object({
  email,
  password,
});

export type AuthRegisterInput = z.infer<typeof authRegisterSchema>;
export type AuthLoginInput = z.infer<typeof authLoginSchema>;
