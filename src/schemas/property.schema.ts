import { z } from "zod";

// Define the blueprint schema for creating a property listing using Zod v4 syntax
export const createPropertySchema = z.object({
  body: z.object({
    title: z
      .string({ error: "Title is required" }) // Changed from required_error to error
      .min(3, "Title must be at least 3 characters long"),

    description: z
      .string({ error: "Description is required" }) // Changed from required_error to error
      .min(10, "Description must be at least 10 characters long"),

    price: z
      .number({ error: "Price is required" }) // Changed from required_error to error
      .positive("Price must be a positive number"),

    location: z
      .string({ error: "Location is required" }) // Changed from required_error to error
      .min(2, "Location is required"),

    ownerId: z
      .string({ error: "Owner ID is required" }) // Changed from required_error to error
      .uuid("Owner ID must be a valid UUID string"),
  }),
});
