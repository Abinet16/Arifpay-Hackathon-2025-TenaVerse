import { prisma } from "../config/prisma.js";
import { logger } from "./logger.js";

export async function recordAudit(adminId: string, action: string, targetId?: string, meta?: any) {
  try {
    await prisma.auditLog.create({
      data: { adminId, action, targetId, meta },
    });
    logger.info(`📝 Audit: ${action} by ${adminId}`);
  } catch (err: any) {
    logger.error(`Audit logging failed: ${err.message}`);
  }
}
