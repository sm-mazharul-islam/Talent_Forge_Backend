import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import prisma from "../config/datebase";

/**
 * Controller handler to submit an application for a property/job listing
 */
export const applyToListing = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { propertyId, coverLetter } = req.body;
    const applicantId = req.user?.userId;

    if (!applicantId) {
      res.status(401).json({
        status: "fail",
        message: "Authentication context missing. Please log in again.",
      });
      return;
    }

    // 1. Verify the target listing exists
    const listingExists = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!listingExists) {
      res.status(404).json({
        status: "fail",
        message:
          "The property/job listing you are trying to apply to does not exist.",
      });
      return;
    }

    // 2. Prevent duplicate submissions
    const alreadyApplied = await prisma.application.findFirst({
      where: {
        applicantId,
        propertyId,
      },
    });

    if (alreadyApplied) {
      res.status(400).json({
        status: "fail",
        message: "You have already submitted an application for this listing.",
      });
      return;
    }

    // 3. Create the database record
    const newApplication = await prisma.application.create({
      data: {
        coverLetter,
        applicantId,
        propertyId,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        application: newApplication,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handler to fetch all applications submitted BY the logged-in candidate
 */
export const getMyApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const applicantId = req.user?.userId;

    if (!applicantId) {
      res.status(401).json({
        status: "fail",
        message: "Authentication context missing. Please log in again.",
      });
      return;
    }

    // Find all applications matching this user, and include property specifics
    const applications = await prisma.application.findMany({
      where: { applicantId },
      include: {
        property: {
          select: {
            title: true,
            location: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      status: "success",
      results: applications.length,
      data: {
        applications,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller handler to fetch all applications submitted TO listings owned by the logged-in user
 */
export const getIncomingApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      res.status(401).json({
        status: "fail",
        message: "Authentication context missing. Please log in again.",
      });
      return;
    }

    // Find applications where the linked property belongs to this recruiter/owner
    const incomingApplications = await prisma.application.findMany({
      where: {
        property: {
          ownerId: ownerId,
        },
      },
      include: {
        property: {
          select: { title: true },
        },
        applicant: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      status: "success",
      results: incomingApplications.length,
      data: {
        applications: incomingApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};
