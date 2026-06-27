import { Router } from "express";
import {
  createProperty,
  getProperties,
} from "../controllers/property.controller.js"; // 1. Import your get controller
import { createPropertySchema } from "../schemas/property.schema";
import { validate } from "../middleware/validate.middleware";

const router = Router();

/**
 * Route: POST /api/properties
 */
router.post("/", validate(createPropertySchema), createProperty);

/**
 * Route: GET /api/properties
 * Fetches all listings along with their respective relationships straight from Supabase
 */
router.get("/", getProperties); // 2. Add this line here!

export default router;
