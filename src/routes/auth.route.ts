import { Router } from "express";
import { register, login } from "../controllers/auth.controller"; // Clean: No extension!
import { validate } from "../middleware/validate.middleware"; // Clean: No extension!
import { loginSchema, registerSchema } from "../schemas/auth.schema"; // Clean: No extension!

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
