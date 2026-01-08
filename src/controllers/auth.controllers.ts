import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { JWT_SECRET } from "../middleware/auth.js";

export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;
    if (!email || !password ) {
        res.status(400).json({ error: "Email and password required" });
        return;
    }
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                cart: { create: {} }
            }
        });
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "24h"
        });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  console.log("--- Login Attempt Started ---");
  const { email, password } = req.body;

  // 1. Check Inputs
  if (!email || !password) {
    console.log("Missing inputs");
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  console.log(`Checking DB for email: ${email}`);

  try {
    // 2. DB Search
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("User not found in DB");
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }
    console.log("User found. Comparing passwords...");

    // 3. Password Compare
    const isValid = await bcrypt.compare(password, user.password);
    console.log(`Password valid? ${isValid}`);
    
    if (!isValid) {
      console.log("Wrong password");
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    // 4. Token Generation
    console.log("Generating token...");
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h"
    });

    console.log("Login successful. Sending response.");
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
