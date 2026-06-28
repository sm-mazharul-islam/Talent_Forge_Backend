import { Router } from "express";
import {
  applyToListing,
  getMyApplications,
  getIncomingApplications,
} from "../controllers/application.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// Submit an application
router.post("/apply", requireAuth, applyToListing);

// Dashboard data routes
router.get("/my-submissions", requireAuth, getMyApplications); // For candidates
router.get("/incoming", requireAuth, getIncomingApplications); // For owners/recruiters

export default router;
