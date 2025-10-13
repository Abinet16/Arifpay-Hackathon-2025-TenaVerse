import { logger } from "./logger.js";

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delay = 700
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      logger.warn(`Retry attempt ${attempt + 1} failed: ${err.message}`);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}
