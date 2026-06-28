import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import prisma from "../config/datebase";

/**
 * Controller handler to create a brand new Property Listing in the database
 */
export const createProperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description, price, location } = req.body;
    const authenticatedUserId = req.user?.userId;

    if (!authenticatedUserId) {
      res.status(401).json({
        status: "fail",
        message: "Authentication context missing. Please log in again.",
      });
      return;
    }

    const newProperty = await prisma.property.create({
      data: {
        title,
        description,
        price: Number(price),
        location,
        ownerId: authenticatedUserId,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        property: newProperty,
      },
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
    const properties = await prisma.property.findMany();

    res.status(200).json({
      status: "success",
      results: properties.length,
      data: {
        properties,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handler to delete a property listing (Owner action only)
 */
export const deleteProperty = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params; // Get property ID from URL parameter
    const ownerId = req.user?.userId;

    // 1. Find the property record to verify existence
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      res.status(404).json({
        status: "fail",
        message: "Property listing not found.",
      });
      return;
    }

    // 2. Strict Security: Enforce that only the resource owner can delete it
    if (property.ownerId !== ownerId) {
      res.status(403).json({
        status: "fail",
        message: "Forbidden. You can only delete your own listings.",
      });
      return;
    }

    // 3. Delete the resource (Cascades automatically to dependent applications)
    await prisma.property.delete({
      where: { id },
    });

    res.status(200).json({
      status: "success",
      message: "Listing and all associated applications removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};
