// src/server.ts
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { prisma } from "./config/prisma.js";

import users from "./routes/users/index.js";
import payments from "./routes/payments.js";
import webhook from "./routes/webhook.js";
import claims from "./routes/claims/index.js";
import admin from "./routes/admin/index.js";
import notifications from "./routes/notifications/index.js";

import { startReportJob } from "./jobs/reportJob.js";

// ---------------- EXPRESS SETUP ----------------
const app = express();
app.use(cors());
app.use(express.json());

// ---------------- HTTP + SOCKET.IO ----------------
const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: "*" },
});

// ---------------- SOCKET AUTH ----------------
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Missing auth token"));

    const decoded = jwt.verify(token, config.authSecret) as { userId: string; role: string };
    (socket as any).userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = (socket as any).userId;
  logger.info(`🔌 Socket connected for user ${userId}`);
  socket.join(userId); // join private room

  socket.on("disconnect", () => logger.info(`🔌 Socket disconnected: ${userId}`));
});

// ---------------- HEALTH CHECK ----------------
app.get("/health", async (_, res) => {
  try {
    const db = await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: !!db });
  } catch (err) {
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});

// ---------------- ROUTES ----------------
app.use("/api/users", users);
app.use("/api/payments", payments);
app.use("/api/payments/webhook", webhook);
app.use("/api/claims", claims);
app.use("/api/admin", admin);
app.use("/api/notifications", notifications);

// ---------------- START CRON JOB ----------------
startReportJob();
logger.info("⏰ Scheduled report job started");

// ---------------- START SERVER ----------------
server.listen(config.port, () => {
  logger.info(`🚀 TenaPay API running with real-time socket on port ${config.port}`);
});
