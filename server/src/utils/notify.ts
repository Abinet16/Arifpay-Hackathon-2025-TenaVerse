import { prisma } from "../config/prisma.js";
import { io } from "../server.js";
import { logger } from "./logger.js";

export async function pushNotification(
  userId: string,
  type: string,
  title: string,
  message: string
) {
  try {
    // Save in DB
    const note = await prisma.notification.create({
      data: { userId, type, title, message },
    });

    // Emit in real time
    io.to(userId).emit("notification", note);
    logger.info(`🔔 Notification sent to user ${userId}: ${title}`);
    return note;
  } catch (err: any) {
    logger.error(`Notification push failed: ${err.message}`);
  }
}
