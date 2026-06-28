import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import prisma from "../config/datebase";

/**
 * Controller handler to create a brand new Property Listing in the database
 */
export const createProperty = async (
  req: AuthenticatedRequest, // 👈 Uses your custom authenticated interface
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Extract core data fields from the request body (ownerId removed from body)
    const { title, description, price, location } = req.body;

    // 2. Extract the secure user ID attached by the requireAuth middleware layer
    const authenticatedUserId = req.user?.userId;

    if (!authenticatedUserId) {
      res.status(401).json({
        status: "fail",
        message: "Authentication context missing. Please log in again.",
      });
      return;
    }

    // 3. Use Prisma to insert a new row into the Property table in PostgreSQL
    const newProperty = await prisma.property.create({
      data: {
        title,
        description,
        price: Number(price), // 👈 Forces dynamic numeric format handling
        location,
        ownerId: authenticatedUserId, // 👈 Securely binds the listing to the logged-in user
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
 * Withdraw/Delete an application (Candidate action only)
 */
export const withdrawApplication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params; // Get application UUID from URL params
    const applicantId = req.user?.userId;

    // 1. Find the application record
    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      res
        .status(404)
        .json({ status: "fail", message: "Application not found." });
      return;
    }

    // 2. Ensure only the applicant can delete it
    if (application.applicantId !== applicantId) {
      res.status(403).json({
        status: "fail",
        message: "Forbidden. You can only withdraw your own applications.",
      });
      return;
    }

    // 3. Delete from database
    await prisma.application.delete({
      where: { id },
    });

    res.status(200).json({
      status: "success",
      message: "Application withdrawn successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handler to fetch all Property Listings from the database
 */
export const getProperties = async (
  req: AuthenticatedRequest,
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
