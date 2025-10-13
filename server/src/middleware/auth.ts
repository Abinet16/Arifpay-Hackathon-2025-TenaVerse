import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/env.js";
import { prisma } from "../config/prisma.js";

interface TokenPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

export function issueToken(userId: string, role: "USER" | "ADMIN") {
  return jwt.sign({ userId, role }, config.authSecret, { expiresIn: "7d" });
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing token" });

    const decoded = jwt.verify(token, config.authSecret) as TokenPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing token" });

    const decoded = jwt.verify(token, config.authSecret) as TokenPayload;

    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
