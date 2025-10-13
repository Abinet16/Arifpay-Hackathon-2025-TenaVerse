import express, { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { logger } from "../../utils/logger.js";

const router = express.Router();

// ✅ Get all notifications for user
router.get("/", requireAuth, async (req, res) => {
  const { userId } = (req as any).user;
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, count: notifications.length, notifications });
});

// ✅ Mark one as read
router.patch("/:id/read", requireAuth, async (req, res) => {
  const { userId } = (req as any).user;
  const { id } = req.params;
  const note = await prisma.notification.updateMany({
    where: { id, userId },
    data: { read: true },
  });
  res.json({ success: true, updated: note.count });
});

// ✅ Delete notification
router.delete("/:id", requireAuth, async (req, res) => {
  const { userId } = (req as any).user;
  const { id } = req.params;
  await prisma.notification.deleteMany({ where: { id, userId } });
  res.json({ success: true });
});

export default router;