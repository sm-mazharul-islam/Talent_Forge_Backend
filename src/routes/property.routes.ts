import { Router } from "express";
import {
  createProperty,
  getProperties,
  withdrawApplication,
} from "../controllers/property.controller";
import { requireAuth } from "../middleware/auth.middleware"; // Import the guard

const router = Router();

// 🔓 Public Route: Anyone can browse properties
router.get("/", getProperties);

// 🔒 Protected Route: Requires a valid JWT token header to create a property
router.post("/", requireAuth, createProperty);

router.delete("/withdraw/:id", requireAuth, withdrawApplication);

export default router;
