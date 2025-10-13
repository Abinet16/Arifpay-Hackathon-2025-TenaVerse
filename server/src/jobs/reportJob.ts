import cron from "node-cron";
import { prisma } from "../config/prisma.js";
import { sendMail } from "../utils/mailer.js";
import { logger } from "../utils/logger.js";

export function startReportJob() {
  // Runs every day at 8 AM
  cron.schedule("0 8 * * *", async () => {
    try {
      const [users, credits, debits, balances] = await Promise.all([
        prisma.user.count(),
        prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: "CREDIT" } }),
        prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: "DEBIT" } }),
        prisma.user.aggregate({ _sum: { balance: true } }),
      ]);

      const collected = credits._sum.amount || 0;
      const claimed = debits._sum.amount || 0;
      const pool = balances._sum.balance || 0;

      const html = `
        <h2>TenaPay Daily Report</h2>
        <ul>
          <li><b>Total Users:</b> ${users}</li>
          <li><b>Total Premiums Collected:</b> ${collected} ETB</li>
          <li><b>Total Claims Paid:</b> ${claimed} ETB</li>
          <li><b>Active Fund Pool:</b> ${pool} ETB</li>
        </ul>
        <p>Generated automatically at ${new Date().toLocaleString()}.</p>
      `;

      await sendMail(process.env.ADMIN_EMAIL!, "TenaPay Daily Summary", html);
      logger.info("📅 Daily report email sent to admin");
    } catch (err: any) {
      logger.error(`Report job failed: ${err.message}`);
    }
  });
}
