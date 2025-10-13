import dotenv from "dotenv";
dotenv.config();

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) throw new Error(`Missing environment variable: ${key}`);
  return value || "";
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  baseUrl: getEnv("ARIFPAY_BASE_URL"),
  merchantId: getEnv("ARIFPAY_MERCHANT_ID"),
  apiKey: getEnv("ARIFPAY_API_KEY"),
  beneficiary: {
    account: getEnv("BENEFICIARY_ACCOUNT"),
    bank: getEnv("BENEFICIARY_BANK"),
  },
  urls: {
    cancel: getEnv("CANCEL_URL"),
    success: getEnv("SUCCESS_URL"),
    error: getEnv("ERROR_URL"),
    notify: getEnv("NOTIFY_URL"),
  },
  authSecret: getEnv("BETTERAUTH_SECRET"),
};
