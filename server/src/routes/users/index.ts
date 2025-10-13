import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { issueToken, requireAuth } from "../../middleware/auth.js";
import { logger } from "../../utils/logger.js";
import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";


const router = express.Router();

// Schema for validation
const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^251\d{9}$/),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// ✅ Register user
// ✅ Register user
router.post("/register", async (req, res) => {
  try {
    const { email, phone, password } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, phone, passwordHash: hash, role: "USER" },
    });

    const token = issueToken(user.id, user.role);
    logger.info(`👤 New user registered: ${email}`);

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = issueToken(user.id, user.role);
    logger.info(`✅ User logged in: ${email}`);

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});


// ✅ Get user profile (protected)
router.get("/me", requireAuth, async (req, res) => {
  try {
    const authHeader = req.headers.authorization!;
    const userId = (authHeader.split(" ")[1]).split(".")[1]; // simplified for demo; BetterAuth verifies it already

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, phone: true, balance: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
