import { z } from "zod";

export const accountIdSchema = z.string().uuid("Valid account ID is required");

const openAccountBaseSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required").max(255),
  lastName: z.string().trim().min(2, "Last name is required").max(255),
  phone: z
    .string()
    .trim()
    .min(9, "Phone must be at least 9 characters")
    .max(15, "Phone must be at most 15 characters")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  faydaNumber: z
    .string()
    .trim()
    .length(16, "Fayda Number must be exactly 16 digits")
    .regex(/^\d+$/, "Fayda Number must contain only digits"),
  dateOfBirth: z.coerce
    .date()
    .refine((date) => date < new Date(), "Date of birth must be in the past")
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 18;
    }, "Applicant must be at least 18 years old"),
  birthPlace: z.string().trim().min(2, "Birth place is required").max(255),
  city: z.string().trim().min(2, "City is required").max(255),
  kebele: z.string().trim().min(1, "Kebele is required").max(255),
});

export const openAccountCreateSchema = openAccountBaseSchema;
export type OpenAccountCreateInput = z.infer<typeof openAccountCreateSchema>;

export const openAccountUpdateSchema = z.object({
  status: z.enum([
    "PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "MORE_INFO_REQUIRED",
  ]),
  statusNotes: z.string().trim().max(1000).optional().nullable(),
});

export type OpenAccountUpdateInput = z.infer<typeof openAccountUpdateSchema>;

