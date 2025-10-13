import express from "express";
import { prisma } from "../config/prisma.js";
import { logger } from "../utils/logger.js";
import { recordTransaction } from "../utils/transactions.js";
import { z } from "zod";
import { sendMail } from "../utils/mailer.js";
import { io } from "../server.js";
import { pushNotification } from "../utils/notify.js";


const router = express.Router();

// ✅ Define expected Arifpay webhook payload
const webhookSchema = z.object({
  sessionId: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  amount: z.number(),
  status: z.string(), // e.g., "SUCCESS"
});

router.post("/", async (req, res) => {
  try {
    const data = webhookSchema.parse(req.body);

    // Only process successful payments
    if (data.status !== "SUCCESS") {
      logger.warn(`Webhook ignored: status=${data.status}`);
      return res.status(200).json({ ok: true });
    }

    // Find user by phone number
    const user = await prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (!user) {
      logger.warn(`Webhook: No user found for phone ${data.phone}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Update balance atomically
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { balance: { increment: data.amount } },
    });
     
          // After updating balance
await sendMail(
  user.email,
  "TenaPay Premium Received",
  `<h3>Payment Successful</h3>
  <p>Your health fund was credited with <b>${data.amount} ETB</b>.</p>
  <p>Current balance: <b>${updatedUser.balance} ETB</b></p>`
);
    // Notify user in real time
await pushNotification(
  user.id,
  "PAYMENT_CREDITED",
  "Payment Received",
  `Your health fund was credited with ${data.amount} ETB.`
);

    // Record transaction
    await recordTransaction(
      user.id,
      "CREDIT",
      data.amount,
      "Premium payment received via Arifpay",
      data.sessionId
    );

    logger.info(`💰 Webhook credited ${data.amount} to ${data.phone}`);
    res.json({ success: true, balance: updatedUser.balance });
  } catch (err: any) {
    logger.error(`Webhook error: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
});

export default router;
