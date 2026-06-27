import { Router } from "express";
import { createProperty } from "../controllers/property.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createPropertySchema } from "../schemas/property.schema.js";

const router = Router();

/**
 * Route: POST /api/properties
 * 1. Takes the request
 * 2. Passes it through the Zod validation middleware gate
 * 3. Sends it to the controller to execute the database query
 */
router.post("/", validate(createPropertySchema), createProperty);

export default router;
