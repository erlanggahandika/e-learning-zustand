// middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";

const createLimiter = (max, msg = "Too many requests") =>
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 menit
    max,
    message: {
      status: false,
      success: false,
      message: msg,
      data: null,
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

const Limiter1hari = (max, msg = "Too many requests") =>
  rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 hari dalam ms
    max,
    message: {
      status: false,
      success: false,
      message: msg,
      data: null,
    },
    standardHeaders: true, // return rate limit info di header
    legacyHeaders: false,  // disable X-RateLimit-* headers
  });
export const Limiter = createLimiter(1);
export const Limiter2 = createLimiter(2);
export const Limiter5 = createLimiter(5);
export const Limiter8 = createLimiter(8);
export const Limiter10 = createLimiter(10);
export const Limiter15 = createLimiter(15);
export const Limiter20 = createLimiter(20);
export const Limiter30 = createLimiter(30);
export const Limiter50 = createLimiter(50);

export const Limiter1days = Limiter1hari(1);