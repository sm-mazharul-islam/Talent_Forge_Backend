import { Router } from "express";
import {
  createProperty,
  getProperties,
  deleteProperty, // 👈 Correctly imported instead of application withdrawal
} from "../controllers/property.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware"; // 🔗 Import your updated validator
import { createPropertySchema } from "../schemas/schemas"; // 🔗 Import your property blueprint

const router = Router();

// 🔓 Public Route: Anyone can browse properties
router.get("/", getProperties);

// 🔒 Protected Route: Validates body fields against Zod structure before allowing creation
router.post(
  "/",
  requireAuth,
  validate(createPropertySchema), // 🛡️ Zod gatekeeper validation layer
  createProperty,
);

// 🔒 Protected Route: Securely delete a property listing using URL parameters
router.delete("/delete/:id", requireAuth, deleteProperty);

export default router;
