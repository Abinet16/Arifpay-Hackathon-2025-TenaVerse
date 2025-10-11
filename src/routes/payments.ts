import express from "express";
import axios from "axios";
import { z } from "zod";
import { config } from "../config/env.js";
import { withRetry } from "../utils/retry.js";
import { totalFromItems } from "../utils/total.js";
import { logger } from "../utils/logger.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// ✅ Schema Validation
const checkoutSchema = z.object({
  phone: z.string().regex(/^251\d{9}$/, "Phone must start with 2519XXXXXXXX"),
  email: z.string().email(),
  nonce: z.string(),
  items: z
    .array(
      z.object({
        price: z.number().positive(),
        quantity: z.number().positive().optional(),
      })
    )
    .nonempty(),
  lang: z.string().default("EN"),
  paymentMethods: z.array(z.string()).default(["TELEBIRR"]),
});

// ✅ POST /api/payments/checkout
router.post("/checkout", requireAuth, async (req, res) => {
  try {
    const { phone, email, nonce, items, lang, paymentMethods } = checkoutSchema.parse(req.body);
    const totalAmount = totalFromItems(items);

    const expireDate = new Date(Date.now() + 20 * 60 * 1000).toISOString();

    const payload = {
      merchant_id: config.merchantId,
      cancelUrl: config.urls.cancel,
      successUrl: config.urls.success,
      errorUrl: config.urls.error,
      notifyUrl: config.urls.notify,
      phone,
      email,
      nonce,
      paymentMethods,
      expireDate,
      items,
      lang,
      beneficiaries: [
        {
          accountNumber: config.beneficiary.account,
          bank: config.beneficiary.bank,
          amount: totalAmount,
        },
      ],
    };

    const response = await withRetry(() =>
      axios.post(`${config.baseUrl}/checkout/session`, payload, {
        headers: {
          "x-arifpay-key": config.apiKey,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      })
    );

    const data = response.data?.data;
    const sessionId = data?.sessionId || data?.Sessionid;
    const checkoutUrl = data?.paymentUrl;

    if (!sessionId || !checkoutUrl) {
      logger.warn("Checkout response missing sessionId/paymentUrl", { raw: data });
      return res.status(502).json({ message: "Arifpay response invalid" });
    }

    logger.info(`✅ Checkout created: session=${sessionId} | amount=${totalAmount}`);
    return res.json({
      success: true,
      sessionId,
      checkoutUrl,
      totalAmount,
    });
  } catch (err: any) {
    logger.error(`Checkout error: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: "Checkout failed",
      error: err.message,
    });
  }
});

// ✅ Schema for B2C Telebirr Transfer
const transferSchema = z.object({
  Sessionid: z.string(),
  PhoneNumber: z.string().regex(/^251\d{9}$/, "Phone must be in 2519XXXXXXXX format"),
});

// ✅ POST /api/payments/telebirr/transfer
router.post("/telebirr/transfer", requireAuth, async (req, res) => {
  try {
    const { Sessionid, PhoneNumber } = transferSchema.parse(req.body);

    const payload = { Sessionid, Phonenumber: PhoneNumber };

    const response = await withRetry(() =>
      axios.post(`${config.baseUrl}/Telebirr/b2c/transfer`, payload, {
        headers: {
          "x-arifpay-key": config.apiKey,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      })
    );

    logger.info(`💸 Telebirr transfer completed: ${PhoneNumber}`);
    return res.json({
      success: true,
      data: response.data,
    });
  } catch (err: any) {
    logger.error(`Telebirr transfer error: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: "Transfer failed",
      error: err.message,
    });
  }
});


export default router;
