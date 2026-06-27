import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import prisma from "../config/datebase";

export const applyToListing = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { propertyId, coverLetter } = req.body;
    const applicantId = req.user?.userId;

    if (!applicantId) {
      res
        .status(401)
        .json({ status: "fail", message: "Unauthorized context." });
      return;
    }

    // 1. Check if the property/job listing actually exists
    const listingExists = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!listingExists) {
      res.status(404).json({ status: "fail", message: "Listing not found." });
      return;
    }

    // 2. Prevent duplicate applications by the same user
    const alreadyApplied = await prisma.application.findFirst({
      where: { applicantId, propertyId },
    });

    if (alreadyApplied) {
      res.status(400).json({
        status: "fail",
        message: "You have already submitted an application for this listing.",
      });
      return;
    }

    // 3. Create the fresh application entry
    const newApplication = await prisma.application.create({
      data: {
        coverLetter,
        applicantId,
        propertyId,
      },
    });

    res.status(201).json({
      status: "success",
      data: { application: newApplication },
    });
  } catch (error) {
    next(error);
  }
};
