import { PrismaClient } from "@prisma/client";
import midtransClient from "midtrans-client";
import dotenv from "dotenv";

dotenv.config();

export const prisma = new PrismaClient();

export const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});
