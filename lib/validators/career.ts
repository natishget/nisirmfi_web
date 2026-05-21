import { z } from "zod";

const textArray = z
  .array(z.string().trim().min(1))
  .min(1, "At least one item is required");

const baseCareerSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(255),
  department: z.string().trim().min(2, "Department is required").max(120),
  location: z.string().trim().min(2, "Location is required").max(120),
  type: z.string().trim().min(2, "Type is required").max(120),
  purpose: z.string().trim().min(10, "Purpose is required").max(1000),
  responsibilities: textArray,
  qualification: textArray,
  salary: z.string().trim().min(1, "Salary is required").max(120),
  benefits: textArray,
  postDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const careerCreateSchema = baseCareerSchema;

export const careerUpdateSchema = baseCareerSchema
  .partial()
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one field is required",
  });

export type CareerCreateInput = z.infer<typeof careerCreateSchema>;
export type CareerUpdateInput = z.infer<typeof careerUpdateSchema>;
