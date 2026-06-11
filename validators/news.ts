import { z } from "zod";

export const newsStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

const baseNewsSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(255),
  category: z.string().trim().min(2, "Category is required").max(120),
  status: newsStatusSchema,
  summary: z.string().trim().min(10, "Summary is required").max(500),
  publishedDate: z.coerce.date(),
  readTime: z.coerce
    .number()
    .int()
    .positive("Read time must be a positive number"),
  imageUrl: z.string().trim().min(1, "Image path or URL is required"),
  isFeatured: z.coerce.boolean().default(false),
});

export const newsCreateSchema = baseNewsSchema;

export const newsUpdateSchema = baseNewsSchema
  .partial()
  .refine((value) => Object.values(value).some((item) => item !== undefined), {
    message: "At least one field is required",
  });

export type NewsCreateInput = z.infer<typeof newsCreateSchema>;
export type NewsUpdateInput = z.infer<typeof newsUpdateSchema>;
