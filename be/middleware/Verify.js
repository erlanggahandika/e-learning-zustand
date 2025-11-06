import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  const refreshToken = req.cookies?.jwt || req.headers["x-refresh-token"];

  if (!accessToken) {
    return res.status(401).json({ status: false, message: "Tidak ada token akses" });
  }

  try {
    // 1️⃣ Verifikasi access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
     const user = await prisma.user.findUnique({ where: { uuid: decoded.uuid } });
    if (!user) {
      return res.status(403).json({ status: false, message: "Akun tidak ditemukan" });
    }

    // 🧩 Pastikan token yang sekarang sama dengan revokedToken (atau token aktif terakhir)
     if (refreshToken && user.tokenJwt !== refreshToken) {
      return res.status(403).json({
        status: false,
        message: "Sesi Anda sudah tidak valid. Silakan login ulang.",
      });
    }
    req.user = decoded;
    return next(); // kalau valid, lanjut aja
  } catch (err) {
    // 2️⃣ Kalau expired → coba refresh token
    if (err.name !== "TokenExpiredError") {
      return res.status(401).json({ status: false, message: "Silahkan login ulang" });
    }

    // Pastikan ada refresh token
    if (!refreshToken) {
      return res.status(403).json({ status: false, message: "Silahkan login ulang" });
    }

    try {
      const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
      const user = await prisma.user.findUnique({ where: { uuid: decodedRefresh.uuid } });

      // Cek validasi refresh token di DB
      if (!user || user.tokenJwt !== refreshToken) {
        return res.status(403).json({ status: false, message: "Silahkan login ulang" });
      }

      // Cek expired refresh token di DB
      const now = new Date();
       const exp = new Date(user.refreshTokenExp);
      if (now > exp) {
        return res.status(403).json({ status: false, message: "Silahkan login ulang" });
      }

      // 3️⃣ Buat access token baru
      const newAccessToken = jwt.sign(
        {
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          tokenVersion: user.tokenVersion,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1h" }
      );

      // 4️⃣ Kirim access token baru di header (opsional)
      res.setHeader("x-access-token", newAccessToken);

      // 5️⃣ Simpan payload ke request dan lanjut
      req.user = decodedRefresh;
      return next();
    } catch (refreshErr) {
      console.log("Error saat refresh token:", refreshErr);
      return res.status(403).json({ status: false, message: "Silahkan login ulang" });
    }
  }
};


export const authadmin = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  const accessToken = req.headers["authorization"]?.split(" ")[1];
  const refreshToken = req.cookies?.jwt || req.headers["x-refresh-token"];
  console.log("token", accessToken);
  if (!accessToken) {
    return res.status(401).json({ status: false, message: "Tidak ada token akses" });
  }

  try {
    // 1️⃣ Verifikasi access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    const user = await prisma.SuperUser.findUnique({ where: { uuid: decoded.uuid } });

    if (!user) {
      return res.status(403).json({ status: false, message: "Akun tidak ditemukan" });
    }

    // 🧩 3️⃣ Pastikan token valid
    if (refreshToken && user.tokenJwt !== refreshToken) {
      return res.status(403).json({
        status: false,
        message: "Sesi Anda sudah tidak valid. Silakan login ulang.",
      });
    }

    req.user = decoded;
    return next(); // ✅ Token valid dan hak akses admin, lanjut
  } catch (err) {
    // 4️⃣ Kalau expired → coba refresh token
    if (err.name !== "TokenExpiredError") {
      return res.status(401).json({ status: false, message: "Silahkan login ulang" });
    }

    // Pastikan ada refresh token
    if (!refreshToken) {
      return res.status(403).json({ status: false, message: "Silahkan login ulang" });
    }

    try {
      const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
      const user = await prisma.user.findUnique({ where: { uuid: decodedRefresh.uuid } });

      // Cek validasi refresh token di DB
      if (!user || user.tokenJwt !== refreshToken) {
        return res.status(403).json({ status: false, message: "Silahkan login ulang" });
      }

     

      // Cek expired refresh token di DB
      const now = new Date();
      const exp = new Date(user.refreshTokenExp);
      if (now > exp) {
        return res.status(403).json({ status: false, message: "Silahkan login ulang" });
      }

      // 5️⃣ Buat access token baru
      const newAccessToken = jwt.sign(
        {
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          tokenVersion: user.tokenVersion,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1h" }
      );

      res.setHeader("x-access-token", newAccessToken);

      req.user = decodedRefresh;
      return next();
    } catch (refreshErr) {
      console.log("Error saat refresh token:", refreshErr);
      return res.status(403).json({ status: false, message: "Silahkan login ulang" });
    }
  }
};
