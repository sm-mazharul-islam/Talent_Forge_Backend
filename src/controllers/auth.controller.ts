import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/datebase";

/**
 * Register a brand new User
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, name, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res
        .status(400)
        .json({ status: "fail", message: "Email already registered" });
      return;
    }

    // Hash the password securely
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user to Supabase
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate User and Issue JWT
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email and cast as any to bypass out-of-sync generation caches
    const user = (await prisma.user.findUnique({ where: { email } })) as any;
    if (!user) {
      res
        .status(401)
        .json({ status: "fail", message: "Invalid email or password" });
      return;
    }

    // Verify password match using the securely selected string layout
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ status: "fail", message: "Invalid email or password" });
      return;
    }

    // Generate JWT Token with safe runtime option payload casting
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      (process.env.JWT_SECRET as string) || "fallback_secret",
      {
        expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any,
      },
    );

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
