import { Request, Response, NextFunction } from "express";
import prisma from "../config/datebase";

/**
 * Controller handler to create a brand new Property Listing in the database
 */
export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Extract the validated fields from the request body
    const { title, description, price, location, ownerId } = req.body;

    // Use Prisma to insert a new row into the Property table in PostgreSQL
    const newProperty = await prisma.property.create({
      data: {
        title,
        description,
        price,
        location,
        ownerId,
      },
    });

    // Respond back to the client with a 201 Created status and the newly created row data
    res.status(201).json({
      status: "success",
      data: {
        property: newProperty,
      },
    });
  } catch (error) {
    // Forward any database execution failures down to the global error handler middleware
    next(error);
  }
};

/**
 * Controller handler to fetch all Property Listings from the database
 */
export const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Fetch all rows from the property table in Supabase
    const properties = await prisma.property.findMany();

    // Respond back to the client with a 200 OK status
    res.status(200).json({
      status: "success",
      results: properties.length,
      data: {
        properties,
      },
    });
  } catch (error) {
    // Forward any database execution failures down to the global error handler middleware
    next(error);
  }
};
