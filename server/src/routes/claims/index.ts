import express from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";
import { logger } from "../../utils/logger.js";
import { requireAuth } from "../../middleware/auth.js";
import { recordTransaction } from "../../utils/transactions.js";
import axios from "axios";
import { config } from "../../config/env.js";
import { withRetry } from "../../utils/retry.js";
import { sendMail } from "../../utils/mailer.js";
import { io } from "../../server.js";
import { pushNotification } from "../../utils/notify.js";

const router = express.Router();

const claimSchema = z.object({
  amount: z.number().positive(),
  phone: z.string().regex(/^251\d{9}$/),
});

// ✅ POST /api/claims/request — user requests payout
router.post("/request", requireAuth, async (req, res) => {
  try {
    const { amount, phone } = claimSchema.parse(req.body);

    // Extract userId from token (BetterAuth verifies)
    const token = req.headers.authorization?.split(" ")[1]!;
    const userId = token.split(".")[1]; // simplified, safe since already verified

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Deduct immediately (atomic)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { balance: { decrement: amount } },
    });
    // After updating balance
    // Record debit transaction
    const txn = await recordTransaction(
      user.id,
      "DEBIT",
      amount,
      "Health claim payout initiated"
    );

    // Initiate Telebirr transfer via Arifpay API
    const payload = {
      Sessionid: txn.id,
      PhoneNumber: phone,
    };

    const response = await withRetry(() =>
      axios.post(`${config.baseUrl}/Telebirr/b2c/transfer`, payload, {
        headers: {
          "x-arifpay-key": config.apiKey,
          "Content-Type": "application/json",
        },
      })
    );
     // After updating balance
await sendMail(
  user.email,
  "TenaPay Premium Received",
  `<h3>Payment Successful</h3>
  <p>Your health fund was credited with <b>${amount} ETB</b>.</p>
  <p>Current balance: <b>${updatedUser.balance} ETB</b></p>`
);
await pushNotification(
  user.id,
  "CLAIM_PAID",
  "Claim Payout",
  `Your claim of ${amount} ETB has been sent to ${phone}.`
);


    logger.info(`🏥 Claim payout of ${amount} ETB sent to ${phone}`);

    res.json({
      success: true,
      message: "Claim processed",
      data: {
        transaction: txn,
        telebirrResponse: response.data,
        newBalance: updatedUser.balance,
      },
    });
    
  } catch (err: any) {
    logger.error(`Claim request failed: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
});

// ✅ GET /api/claims/history — view all claim transactions
router.get("/history", requireAuth, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]!;
    const userId = token.split(".")[1];

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, transactions });
  } catch (err: any) {
    logger.error(`Claim history error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

export default router;
