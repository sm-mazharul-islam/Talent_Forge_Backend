import { Router } from "express";
import { applyToListing } from "../controllers/application.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// All application actions require an active logged-in session
router.post("/apply", requireAuth, applyToListing);

export default router;
