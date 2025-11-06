import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';

dotenv.config();

const snap = new midtransClient.Snap({
  isProduction: false, // ganti true kalau produksi
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export default snap;