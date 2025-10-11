import { prisma } from "../config/prisma.js";

export async function recordTransaction(
  userId: string,
  type: "CREDIT" | "DEBIT",
  amount: number,
  description?: string,
  reference?: string
) {
  return prisma.transaction.create({
    data: { userId, type, amount, description, reference },
  });
}
