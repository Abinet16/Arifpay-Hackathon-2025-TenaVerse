import express from "express";
import { prisma } from "../../config/prisma.js";
import { requireAuth } from "../../middleware/auth.js";
import { logger } from "../../utils/logger.js";
import { recordAudit } from "../../utils/audit.js";

const router = express.Router();

// 🧩 Admin middleware (placeholder)
async function requireAdmin(req: any, res: any, next: any) {
  // For demo, assume first registered user is admin
  // In production, you'd use a role field in your User model
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  next();
}

// ✅ GET /api/admin/overview — platform-wide analytics
router.get("/overview", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const [totalUsers, totalPremiums, totalClaims, fundPool] = await Promise.all([
      prisma.user.count(),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { type: "CREDIT" },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { type: "DEBIT" },
      }),
      prisma.user.aggregate({ _sum: { balance: true } }),
    ]);

    const totalCollected = totalPremiums._sum.amount || 0;
    const totalClaimed = totalClaims._sum.amount || 0;
    const totalBalance = fundPool._sum.balance || 0;

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalCollected,
        totalClaimed,
        totalBalance,
      },
    });
    
  } catch (err: any) {
    logger.error(`Admin overview failed: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET /api/admin/users — list all users with transactions
router.get("/users", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err: any) {
    logger.error(`Admin user list failed: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET /api/admin/user/:id — detailed user profile
router.get("/user/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const creditTotal = user.transactions
      .filter((t: { type: string; }) => t.type === "CREDIT")
      .reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);
    const debitTotal = user.transactions
      .filter((t: { type: string; }) => t.type === "DEBIT")
      .reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);

    res.json({
      success: true,
      user: {
        ...user,
        totalCredits: creditTotal,
        totalDebits: debitTotal,
        netFlow: creditTotal - debitTotal,
      },
    });
  } catch (err: any) {
    logger.error(`Admin user details failed: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});
// ✅ GET /api/admin/audits — recent admin actions
router.get("/audits", requireAuth, requireAdmin, async (_req, res) => {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      admin: { select: { email: true, phone: true, role: true } },
    },
  });
  res.json({ success: true, logs });
});


export default router;
