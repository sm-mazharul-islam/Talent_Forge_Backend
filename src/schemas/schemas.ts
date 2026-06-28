import { z } from "zod";

// 🔐 Login/Registration Validation Blueprints
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Please provide a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    name: z.string().optional(),
  }),
});

// 🏢 Property Listing Validation Blueprints
export const createPropertySchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters long.")
      .max(100),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long."),
    price: z.preprocess(
      (val) => Number(val),
      z.number().positive("Price must be a positive number."),
    ),
    location: z.string().min(3, "Location description is too short."),
  }),
});

// 📑 Application Validation Blueprints
export const applySchema = z.object({
  body: z.object({
    propertyId: z
      .string()
      .uuid("Invalid property listing identification reference format."),
    coverLetter: z
      .string()
      .min(
        20,
        "Cover letter should be at least 20 characters long to look professional.",
      ),
  }),
});
