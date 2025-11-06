import { PrismaClient } from "@prisma/client";
import argon2, { argon2id } from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendOtpEvent, berhasilRegister } from "../../../email/authmail/sendOtp.js";
import { v4 as uuidv4 } from 'uuid';
import { UAParser } from "ua-parser-js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { createNotification } from "../../../service/notificationService.js";
const prisma = new PrismaClient();

dotenv.config();

export const loginBase = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input dasar
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: "Email dan password wajib diisi",
      data: null,
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      status: false,
      message: "Format email tidak valid",
      data: null,
    });
  }

  try {
    
    //Cek apakah user ada
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({
        status: false,
        message: "Email atau password salah",
        data: null,
      });
    }


    //Verifikasi password
    const isValid = await argon2.verify(user.password, password, {
      type: argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    if (!isValid) {
      return res.status(401).json({
        status: false,
        message: "Email atau password salah",
        data: null,
      });
    }

    //Buat payload JWT
    const { uuid, name, tokenVersion, id } = user;
    const payload = { uuid, name, email, tokenVersion };
    const jti = uuidv4();

    //Generate token
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: "2h", // bisa 15m - 1h
    });

    const refreshToken = jwt.sign({ ...payload, jti }, process.env.REFRESH_TOKEN, {
      expiresIn: "7d",
    });

    const refreshExp = new Date();
    refreshExp.setDate(refreshExp.getDate() + 7);

    // Simpan refresh token di database
    await prisma.user.update({
      where: { id },
      data: {
        tokenJwt: refreshToken, // ganti nama kolom jadi "refreshToken" biar lebih jelas
         refreshTokenExp: refreshExp,
        lastLogin: new Date(),
      },
    });

    //Ambil info device
    const userAgent = req.headers["user-agent"] || "unknown";
    const parser = new UAParser(userAgent);
    const parsedUA = parser.getResult();

    const browser = parsedUA.browser?.name || "Peramban Tidak Dikenal";
    const os = parsedUA.os?.name || "Sistem Tidak Diketahui";
    const deviceType =
      parsedUA.device?.model ||
      parsedUA.device?.vendor ||
      (parsedUA.device?.type ? parsedUA.device?.type : "Desktop/Laptop");

    const deviceInfo = `${browser} di ${os} (${deviceType})`;

    const ip =
      (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown")?.toString();

    const location =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "Lokasi Tidak Diketahui";

    // Simpan refresh token ke cookie (aman untuk web)
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true, // true kalau di production pakai HTTPS
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    // console.log("uuid", uuid);
    //Buat notifikasi login baru
   await createNotification({
    title: "Aktivitas Login Baru Terdeteksi",
    message: `Hai ${name || "Pengguna"}, kami mendeteksi login terbaru.`,
    type: "Peringatan Keamanan",
    email,
    uuid: uuid,
  });

   await prisma.loginActivity.create({
     data: {
       userUuid: uuid,
       ipAddress: ip,
       location: location,
       deviceInfo: deviceInfo,
       status: "success",
       loginMethod: "base",
       loginTime: new Date(),
       createdAt: new Date(),
     },
   })

  // Hitung total login user
    const totalLogin = await prisma.loginActivity.count({
      where: { userUuid: uuid },
    });

    const maxRecord = 10; 

    if (totalLogin > maxRecord) {
      // Ambil yang paling lama
      const oldRecords = await prisma.loginActivity.findMany({
        where: { userUuid: uuid },
        orderBy: { createdAt: "asc" },
        take: totalLogin - maxRecord, // ambil kelebihan
        select: { id: true },
      });

      // Hapus semua yang id-nya termasuk dalam list
      await prisma.loginActivity.deleteMany({
        where: { id: { in: oldRecords.map((r) => r.id) } },
      });
    }




    // Response ke client
    return res.status(200).json({
      status: true,
      success: true,
      message: "Login berhasil",
      data: {
        accessToken,
        refreshToken,
        user: {
          uuid,
          name,
          email,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error.message, error.stack);
    console.error("Login error:", error);
    return res.status(500).json({
      status: false,
      success: false,
      message: "Terjadi kesalahan pada server",
      data: null,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // Ambil refresh token dari cookie atau header
    const token = req.cookies?.jwt || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ status: false, message: "Token tidak ditemukan" });
    }

    // Verifikasi refresh token JWT
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);
    const user = await prisma.user.findUnique({ where: { uuid: decoded.uuid } });

    // Cek di database apakah token cocok dan masih aktif
    if (!user || user.tokenJwt !== token) {
      return res.status(403).json({ status: false, message: "Refresh token tidak valid atau sudah diganti" });
    }

    // Cek tanggal kedaluwarsa dari DB (misal disimpan di kolom refreshTokenExp)
    const now = new Date();
    const refreshExp = new Date(user.refreshTokenExp);

    // Kalau refresh token expired → paksa login ulang
    if (now > refreshExp) {
      return res.status(403).json({ status: false, message: "Refresh token sudah expired, silakan login ulang" });
    }

    // Kalau sisa masa aktif < 2 hari → buat refresh token baru
    const timeLeft = (refreshExp - now) / (1000 * 60 * 60 * 24); // dalam hari
    let newRefreshToken = token;

    if (timeLeft < 2) {
      const newPayload = {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        tokenVersion: user.tokenVersion,
      };

      newRefreshToken = jwt.sign(newPayload, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
      const newRefreshExp = new Date();
      newRefreshExp.setDate(newRefreshExp.getDate() + 7);

      await prisma.user.update({
        where: { uuid: user.uuid },
        data: {
          tokenJwt: newRefreshToken,
          refreshTokenExp: newRefreshExp,
        },
      });
    }

    // Buat access token baru (berlaku 1 jam)
    const accessPayload = {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };

    const newAccessToken = jwt.sign(accessPayload, process.env.ACCESS_TOKEN, { expiresIn: "1h" });

    // Kirim balik token baru
    return res.status(200).json({
      status: true,
      message: timeLeft < 2 ? "Access & refresh token diperbarui" : "Access token diperbarui",
      data: {
        accessToken: newAccessToken,
        refreshToken: timeLeft < 2 ? newRefreshToken : undefined, // kirim kalau diperpanjang
      },
    });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(403).json({
      status: false,
      message: "Refresh token tidak valid atau expired",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const token = req.user.uuid;

    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const user = await prisma.user.findUnique({
      where: { uuid: token },
      select: { uuid: true, email: true, name: true, createdAt: true },
    });
    
    res.json({ success: true, data:user });
  } catch (error) {
    console.error("Error getProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const registerBase = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Terdapat field kosong" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(200).json({
      status: false,
      message: "Format email tidak valid",
      data: null,
    });
  }
 

  try {
    // Cek apakah email sudah ada di tabel user atau register
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const existingRegister = await prisma.register.findUnique({ where: { email } });

    if (existingUser || existingRegister) {
      return res.status(400).json({ msg: "Email telah terdaftar" });
    }
    console.log("Emailterdaftar");

    // Hash password
    const hash = await argon2.hash(password);

    // Buat user baru di tabel register
    const create = await prisma.register.create({
      data: {
        name,
        email,
        password: hash,
        otp: null,
      },
    });

    // 🔍 Cek apakah masih ada OTP aktif
    const activeOtp = await prisma.otpPengguna.findFirst({
      where: {
        email,
        expiredAt: { gt: new Date() },
        isUsed: false,
      },
      orderBy: { createdAt: "desc" },
    });

    // 🔍 Cek cooldown minimal 2 menit
    if (activeOtp) {
      const now = new Date();
      if (now - activeOtp.createdAt < 2 * 60 * 1000) {
        return res.status(429).json({
          msg: "OTP sudah dikirim, silakan cek email atau tunggu 2 menit sebelum minta OTP baru.",
        });
      }
    }

    // ✅ Generate OTP baru
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiredAt = new Date(Date.now() + 20 * 60 * 1000); // 20 menit

    if (activeOtp) {
      // Update OTP aktif
      await prisma.otpPengguna.update({
        where: { id: activeOtp.id },
        data: {
          otp_code: otp,
          expiredAt,
          type: "register",
          createdAt: new Date(),
        },
      });
    } else {
      // Buat OTP baru
      await prisma.otpPengguna.create({
        data: {
          email,
          otp_code: otp,
          expiredAt,
           isUsed: false,
          type: "register",
          isUsed: false,
          createdAt: new Date(),
        },
      });
    }

    // console.log("OTP:", name, email, otp);
    await sendOtpEvent(email, name, otp);

    return res.status(201).json({
      success: true,
      status: true,
      msg: "Pendaftaran berhasil, silahkan periksa email untuk verifikasi",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const resendRegisterOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email wajib diisi" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Format email tidak valid" });
  }

  try {
    // Cek apakah user sudah register sebelumnya
    const register = await prisma.register.findUnique({ where: { email } });
    if (!register) {
      return res.status(404).json({ success: false, message: "Email belum terdaftar" });
    }

    // Cek OTP aktif terbaru
    const activeOtp = await prisma.otpPengguna.findFirst({
      where: {
        email,
        expiredAt: { gt: new Date() },
        isUsed: false,
      },
      orderBy: { createdAt: "desc" },
    });

    // Cek cooldown 2 menit
    if (activeOtp) {
      const now = new Date();
      if (now - activeOtp.createdAt < 2 * 60 * 1000) {
        return res.status(429).json({
          success: false,
          message: "Tunggu 2 menit sebelum minta OTP baru.",
        });
      }
    }

    // Generate OTP baru
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiredAt = new Date(Date.now() + 20 * 60 * 1000); // 20 menit

    if (activeOtp) {
      // Update OTP aktif
      await prisma.otpPengguna.update({
        where: { id: activeOtp.id },
        data: {
          otp_code: otp,
          expiredAt,
          type: "register",
          createdAt: new Date(),
        },
      });
    } else {
      // Buat OTP baru
      await prisma.otpPengguna.create({
        data: {
          email,
          otp_code: otp,
          expiredAt,
          type: "register",
          isUsed: false,
          createdAt: new Date(),
        },
      });
    }

    // Kirim OTP via email
    await sendOtpEvent(email, register.name, otp);

    return res.status(200).json({
      success: true,
      message: "OTP berhasil dikirim ulang, silakan periksa email Anda.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server: " + error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp_code } = req.body;

  if (!email || !otp_code) {
    return res.status(400).json({ msg: "Terdapat field kosong" });
  }

   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(200).json({
      status: false,
      message: "Format email tidak valid",
      data: null,
    });
  }

  try {
    const activeOtp = await prisma.otpPengguna.findFirst({
      where: {
        email,
        expiredAt: { gt: new Date() },
        isUsed: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!activeOtp) {
      return res.status(400).json({ msg: "OTP tidak ditemukan atau sudah expired" });
    }

    if (activeOtp.otp_code !== otp_code) {
      return res.status(400).json({ msg: "OTP salah" });
    }

   
    await prisma.otpPengguna.update({
      where: { id: activeOtp.id },
      data: { isUsed: true, updatedAt: new Date() },
    });

    const register = await prisma.register.findUnique({ where: { email } });
   

   
     const user = await prisma.user.create({
        data: {
          name: register.name,
          email: register.email,
          password: register.password,
          avatar: "/uploads/avatar1.png",
        },
      })

      await prisma.register.delete({
        where: { email }
      });
     
      await berhasilRegister(user.email, user.name);

    return res.status(200).json({ 
      success: true,
      message: "OTP berhasil diverifikasi",
      data: {
        uuid: user.uuid,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const recoveryPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: false, message: "Terdapat field kosong", data: null });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ status: false, message: "Format email tidak valid", data: null });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ status: false, message: "User tidak ditemukan", data: null });
    }

    // Cek OTP aktif terbaru
    let otpRecord = await prisma.otpPengguna.findFirst({
      where: {
        email,
        type: "recovery_password",
        isUsed: false,
        expiredAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    let otp;
    const now = new Date();
    const otpValidity = 5 * 60 * 1000; // 5 menit
    const otpRequestLimit = 2 * 60 * 1000; // 2 menit

    if (otpRecord) {
      const timeSinceCreated = now - otpRecord.createdAt;

      if (timeSinceCreated < otpRequestLimit) {
        // Jika masih dalam batas 2 menit, jangan buat OTP baru
        return res.status(429).json({
          status: false,
          message: `Tunggu ${Math.ceil((otpRequestLimit - timeSinceCreated) / 1000)} detik sebelum meminta OTP baru`,
          data: null,
        });
      }

      // Buat OTP baru karena sudah melewati limit
      otp = Math.floor(100000 + Math.random() * 900000).toString();

      otpRecord = await prisma.otpPengguna.create({
        data: {
          email,
          otp_code: otp,
          type: "recovery_password",
          isUsed: false,
          expiredAt: new Date(now.getTime() + otpValidity),
        },
      });
    } else {
      // Belum ada OTP aktif, buat baru
      otp = Math.floor(100000 + Math.random() * 900000).toString();

      otpRecord = await prisma.otpPengguna.create({
        data: {
          email,
          otp_code: otp,
          type: "recovery_password",
          isUsed: false,
          expiredAt: new Date(now.getTime() + otpValidity),
        },
      });
    }

    // Kirim email OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

     await transporter.sendMail({
  from: `"AjarinAja Security" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Verifikasi OTP Pemulihan Password Anda",
  html: `
  <body style="margin:0; padding:0; background-color:#f5f7fa; font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto;">
      <tr>
        <td style="padding:40px 0; text-align:center;">
          <a href="#" style="text-decoration:none;">
            <h1 style="color:#2563eb; font-size:24px; margin:0; font-weight:700;">AjarinAja</h1>
          </a>
        </td>
      </tr>

      <tr>
        <td>
          <table width="100%" cellpadding="0" cellspacing="0" 
            style="background-color:#ffffff; border-radius:16px; box-shadow:0 8px 25px rgba(0,0,0,0.05); padding:40px;">
            
            <tr>
              <td style="text-align:center;">
                <h2 style="color:#111827; font-size:22px; margin-bottom:10px;">Hai ${user.name},</h2>
                <p style="color:#374151; font-size:16px; line-height:1.6; margin:0 0 24px;">
                  Kami menerima permintaan untuk <strong>memulihkan password akun Anda</strong>.
                  Gunakan kode verifikasi di bawah ini untuk melanjutkan proses.
                </p>
              </td>
            </tr>

            <tr>
              <td style="text-align:center; padding:24px 0;">
                <div style="display:inline-block; background-color:#f9fafb; border-radius:12px; border:1px solid #e5e7eb; padding:18px 36px;">
                  <span style="font-size:36px; font-weight:700; color:#111827; letter-spacing:6px;">${otp}</span>
                </div>
              </td>
            </tr>

            <tr>
              <td style="text-align:center;">
                <p style="color:#6b7280; font-size:14px; margin:8px 0;">
                  OTP ini berlaku selama <strong>5 menit</strong>.
                </p>
                <p style="color:#9ca3af; font-size:13px; margin-top:16px;">
                  Jika Anda tidak meminta reset password, abaikan email ini.
                  Akun Anda tetap aman 
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:32px; border-top:1px solid #e5e7eb; text-align:center;">
                <p style="color:#9ca3af; font-size:12px; margin-top:16px;">
                  Email ini dikirim secara otomatis oleh sistem <strong></strong>.<br/>
                  Mohon untuk tidak membalas pesan ini.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <tr>
        <td style="text-align:center; padding:24px 0;">
          <p style="color:#9ca3af; font-size:12px;">© ${new Date().getFullYear()} . All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
  `,
    });


    return res.status(200).json({
      status: true,
      success: true,
      message: "OTP berhasil dikirim ke email Anda",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan server", data: null });
  }
}; //termasuk resend otp

export const resendRecoveryPasswordOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: false,
      message: "Email wajib diisi",
      data: null,
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      status: false,
      message: "Format email tidak valid",
      data: null,
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    const now = new Date();
    const otpValidity = 5 * 60 * 1000; // OTP berlaku 5 menit
    const otpRequestLimit = 2 * 60 * 1000; // Minimal jarak antar OTP 2 menit

    // Cari OTP aktif terbaru
    let otpRecord = await prisma.otpPengguna.findFirst({
      where: {
        email,
        type: "recovery_password",
        isUsed: false,
        expiredAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    });

    if (otpRecord) {
      const timeSinceCreated = now - otpRecord.createdAt;
      if (timeSinceCreated < otpRequestLimit) {
        return res.status(429).json({
          status: false,
          message: `Tunggu ${Math.ceil((otpRequestLimit - timeSinceCreated) / 1000)} detik sebelum meminta OTP baru`,
          data: null,
        });
      }
    }

    // Generate OTP baru
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Simpan OTP baru
    otpRecord = await prisma.otpPengguna.create({
      data: {
        email,
        otp_code: otp,
        type: "recovery_password",
        isUsed: false,
        expiredAt: new Date(now.getTime() + otpValidity),
      },
    });

    // Kirim email OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

      await transporter.sendMail({
  from: `" Security" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Verifikasi OTP Pemulihan Password Anda",
  html: `
  <body style="margin:0; padding:0; background-color:#f5f7fa; font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto;">
      <tr>
        <td style="padding:40px 0; text-align:center;">
          <a href="#" style="text-decoration:none;">
            <h1 style="color:#2563eb; font-size:24px; margin:0; font-weight:700;"></h1>
          </a>
        </td>
      </tr>

      <tr>
        <td>
          <table width="100%" cellpadding="0" cellspacing="0" 
            style="background-color:#ffffff; border-radius:16px; box-shadow:0 8px 25px rgba(0,0,0,0.05); padding:40px;">
            
            <tr>
              <td style="text-align:center;">
                <h2 style="color:#111827; font-size:22px; margin-bottom:10px;">Hai ${user.name},</h2>
                <p style="color:#374151; font-size:16px; line-height:1.6; margin:0 0 24px;">
                  Kami menerima permintaan untuk <strong>memulihkan password akun Anda</strong>.
                  Gunakan kode verifikasi di bawah ini untuk melanjutkan proses.
                </p>
              </td>
            </tr>

            <tr>
              <td style="text-align:center; padding:24px 0;">
                <div style="display:inline-block; background-color:#f9fafb; border-radius:12px; border:1px solid #e5e7eb; padding:18px 36px;">
                  <span style="font-size:36px; font-weight:700; color:#111827; letter-spacing:6px;">${otp}</span>
                </div>
              </td>
            </tr>

            <tr>
              <td style="text-align:center;">
                <p style="color:#6b7280; font-size:14px; margin:8px 0;">
                  OTP ini berlaku selama <strong>5 menit</strong>.
                </p>
                <p style="color:#9ca3af; font-size:13px; margin-top:16px;">
                  Jika Anda tidak meminta reset password, abaikan email ini.
                  Akun Anda tetap aman 
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:32px; border-top:1px solid #e5e7eb; text-align:center;">
                <p style="color:#9ca3af; font-size:12px; margin-top:16px;">
                  Email ini dikirim secara otomatis oleh sistem <strong></strong>.<br/>
                  Mohon untuk tidak membalas pesan ini.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <tr>
        <td style="text-align:center; padding:24px 0;">
          <p style="color:#9ca3af; font-size:12px;">© ${new Date().getFullYear()} . All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
  `,
    });

    return res.status(200).json({
      status: true,
      success: true,
      message: "OTP recovery password berhasil dikirim ulang",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      success: false,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
}; //blm kepake di mobile

export const validateRecoveryPassword = async (req, res) => {
  const { email, otp_code } = req.body;

  if (!email || !otp_code) {
    return res.status(400).json({
      status: false,
      message: "Email dan OTP wajib diisi",
      data: null,
    });
  }

  try {
    // Cari OTP aktif yang sesuai
    const otpRecord = await prisma.otpPengguna.findFirst({
      where: {
        email,
        otp_code,
        type: "recovery_password",
        isUsed: false,
        expiredAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return res.status(400).json({
        status: false,
        message: "OTP tidak valid atau sudah kadaluarsa",
        data: null,
      });
    }

    // Tandai OTP sebagai sudah digunakan
    await prisma.otpPengguna.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    // Generate recovery_token 32 karakter
    const recovery_token = crypto.randomBytes(16).toString("hex");
    const expiredAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    // Simpan recovery_token sebagai record baru di tabel yang sama
    await prisma.otpPengguna.create({
      data: {
        email,
        type: "recovery_password",
        otp_code: null,
        recovery_token: recovery_token,
        isUsed: false,
        expiredAt,
      },
    });

    return res.status(200).json({
      status: true,
      success: true,
      message: "OTP valid, recovery token berhasil dibuat",
      data: {
        recovery_token,
        expires_in: 10 * 60, // detik
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      success: false,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { recovery_token, password } = req.body;

  if (!recovery_token || !password) {
    return res.status(400).json({
      status: false,
      success: false,
      message: "Recovery token dan password baru wajib diisi",
      data: null,
    });
  }

  try {
    // Cari token recovery aktif
    const tokenRecord = await prisma.otpPengguna.findFirst({
      where: {
        recovery_token,
        type: "recovery_password",
        isUsed: false,
        expiredAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!tokenRecord) {
      return res.status(400).json({
        status: false,
        success: false,
        message: "Ulangi sesi anda untuk mereset password",
        data: null,
      });
    }

    // Hash password baru dengan argon2
    const hashedPassword = await argon2.hash(password, { timeCost: 8 });

    // Update password user berdasarkan email dari token
    await prisma.user.update({
      where: { email: tokenRecord.email },
      data: { password: hashedPassword },
    });

    // Tandai recovery token sudah digunakan
    await prisma.otpPengguna.update({
      where: { id: tokenRecord.id },
      data: { isUsed: true },
    });

    console.log(tokenRecord);

    await prisma.notifikasi.create({
      data: {
        title: "Perubahan Password",
        message: `Terjadi perubahan password akun mu baru baru ini. Jika kamu tidak meminta perubahan password, abaikan notifikasi ini.`,
        type: "Peringatan Login!",
        email: tokenRecord.email,
      },
    });

    return res.status(200).json({
      status: true,
      success: true,
      message: "Password berhasil diubah",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      success: false,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
}; //notif, ga login

export const verifyOtpViaLink = async (req, res) => {
    const { email, kode } = req.query;
  
    const renderHTML = (title, message, color = "#1a202c") => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    /* Reset and base */
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      background-color: #f9fafb;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #2d3748;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      background: #ffffff;
      max-width: 440px;
      width: 100%;
      padding: 48px 40px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      text-align: center;
    }
    h1 {
      font-weight: 700;
      font-size: 2.25rem;
      margin-bottom: 16px;
      color: ${color};
    }
    p.message {
      font-size: 1.125rem;
      color: #4a5568;
      margin-bottom: 32px;
      line-height: 1.5;
    }
    ul.info-list {
      text-align: left;
      margin-bottom: 32px;
      padding-left: 1.2em;
      color: #718096;
      font-size: 0.95rem;
      list-style: disc;
    }
    ul.info-list li {
      margin-bottom: 10px;
    }
    a.btn-primary {
      display: inline-block;
      padding: 14px 32px;
      background-color: #2b6cb0;
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      border-radius: 8px;
      transition: background-color 0.3s ease;
      box-shadow: 0 4px 8px rgb(43 108 176 / 0.3);
    }
    a.btn-primary:hover {
      background-color: #234e8a;
      box-shadow: 0 6px 12px rgb(35 78 138 / 0.4);
    }
    .links {
      margin-top: 24px;
      font-size: 0.9rem;
      color: #a0aec0;
    }
    .links a {
      color: #2b6cb0;
      text-decoration: none;
      margin: 0 8px;
    }
    .links a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <main class="container" role="alert">
    <h1>${title}</h1>
    <p class="message">${message}</p>

    <ul class="info-list">
      <li>Akun Anda sudah terverifikasi dengan aman.</li>
      <li>Mulai jelajahi fitur kami yang inovatif.</li>
      <li>Jaga keamanan akun Anda dengan kata sandi yang kuat.</li>
    </ul>
   

    <a href="${process.env.FE_URL || "http://localhost:5173"}/signin" class="btn-primary" aria-label="Login Sekarang">Login Sekarang</a>

    <div class="links">
      <p>
        Dengan melanjutkan, Anda menyetujui
        <a href="${process.env.FE_URL || "http://localhost:5173"}/terms">Syarat & Ketentuan</a> dan
        <a href="${process.env.FE_URL || "http://localhost:5173"}/privacy">Kebijakan Privasi</a>.
      </p>
    </div>
  </main>
</body>
</html>
`;

  
    if (!email || !kode) {
      return res.send(renderHTML("Verifikasi Gagal", "Email atau kode OTP tidak ditemukan.", "#dc3545"));
    }
  
    try {
      const otpRecord = await prisma.emailOtp.findFirst({
        where: {
          email,
          otp: kode,
          isUsed: false,
          expiredAt: {
            gte: new Date()
          }
        }
      });
      console.log(otpRecord);
  
      if (!otpRecord) {
        return res.send(renderHTML("OTP Tidak Valid", "OTP sudah digunakan atau kedaluwarsa. Silakan daftar ulang atau minta kode baru.", "#ffc107"));
      }
  
      await prisma.emailOtp.update({
        where: { id: otpRecord.id },
        data: { isUsed: true }
      });

      //ambil taable register
      const register = await prisma.register.findUnique({
        where: {
          email: email
        }
      });

      const now = new Date();
      const expiredAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 hari dari sekarang
      const ishash = uuidv4();
       await prisma.user.create({
        data: {
          name: register.name,
          email: register.email,
          password: register.password,
          
        },
      })

      await prisma.register.delete({
        where: { email }
      });
       await prisma.emailOtp.delete({
        where: { email }
      });

      const user = await prisma.user.findUnique({
        where: { email }
      });

    //   await berhasilRegister(email, user.name, user.role);
      
      return res.send(renderHTML("Verifikasi Berhasil 🎉", "OTP berhasil diverifikasi. Kamu bisa login sekarang."));
    } catch (error) {
      return res.send(renderHTML("Terjadi Kesalahan", error.message, "#dc3545"));
    }
  };

export const changePassword = async (req, res) => {
  const { old_password, password } = req.body;

  if (!old_password || !password) {
    return res.status(400).json({
      status: false,
      success: false,
      message: "Password lama dan password baru wajib diisi",
      data: null,
    });
  }

  try {
    // Ambil user dari req.user (dari middleware auth)
    const userId = req.user.uuid;
    if (!userId) {
         return res.status(409).json({
            status: true,
            success: false,
            message: "Silahkan login terlebih dahulu!",
        })
    }

    const user = await prisma.user.findUnique({ where: { uuid: userId } });
    if (!user) {
      return res.status(404).json({
        status: false,
        success: false,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    // Verifikasi password lama
    const isValid = await argon2.verify(user.password, old_password);
    if (!isValid) {
      return res.status(400).json({
        status: false,
        success: false,
        message: "Password lama salah",
        data: null,
      });
    }

    // Hash password baru
    const hashedPassword = await argon2.hash(password, { timeCost: 8 });

    // Update password
    await prisma.user.update({
      where: { uuid: userId },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      status: true,
      success: true,
      message: "Password berhasil diubah",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      success: false,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
}; // notif, harus login

export const kelolaProfile = async (req, res) => {
  const userId = req.user.uuid;
  if (!userId) {
         return res.status(409).json({
            status: true,
            success: false,
            message: "Silahkan login terlebih dahulu!",
        })
    }

    const user = await prisma.user.findUnique({ where: { uuid: userId } });
    if (!user) {
      return res.status(404).json({
        status: false,
        success: false,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    const { name, phone, email } = req.body;

   try {
    await prisma.user.update({
      where: { uuid: userId },
      data: { name, phone },
    })

    await createNotification({ 
      title: "",
      message: `Profile berhasil diubah`,
      type: "Perubahan Profile",
      email,
      uuid: userId
    });

    return res.status(200).json({
      status: true,
      success: true,
      message: "Profile berhasil diubah",
      data: null,
    });
   } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      success: false,
      message: "Terjadi kesalahan server",
      data: null,
    });
   }
} //notif , harus login

export const recoveryPasswordsudahlogin = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ status: false, message: "Terdapat field kosong", data: null });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ status: false, message: "Format email tidak valid", data: null });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ status: false, message: "User tidak ditemukan", data: null });
    }

    // Cek OTP aktif terbaru
    let otpRecord = await prisma.otpPengguna.findFirst({
      where: {
        email,
        type: "recovery_password",
        isUsed: false,
        expiredAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    let otp;
    const now = new Date();
    const otpValidity = 5 * 60 * 1000; // 5 menit
    const otpRequestLimit = 2 * 60 * 1000; // 2 menit

    if (otpRecord) {
      const timeSinceCreated = now - otpRecord.createdAt;

      if (timeSinceCreated < otpRequestLimit) {
        // Jika masih dalam batas 2 menit, jangan buat OTP baru
        return res.status(429).json({
          status: false,
          message: `Tunggu ${Math.ceil((otpRequestLimit - timeSinceCreated) / 1000)} detik sebelum meminta OTP baru`,
          data: null,
        });
      }

      // Buat OTP baru karena sudah melewati limit
      otp = Math.floor(100000 + Math.random() * 900000).toString();

      otpRecord = await prisma.otpPengguna.create({
        data: {
          email,
          otp_code: otp,
          type: "recovery_password",
          isUsed: false,
          expiredAt: new Date(now.getTime() + otpValidity),
        },
      });
    } else {
      // Belum ada OTP aktif, buat baru
      otp = Math.floor(100000 + Math.random() * 900000).toString();

      otpRecord = await prisma.otpPengguna.create({
        data: {
          email,
          otp_code: otp,
          type: "recovery_password",
          isUsed: false,
          expiredAt: new Date(now.getTime() + otpValidity),
        },
      });
    }

    // Kirim email OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

      await transporter.sendMail({
  from: `" Security" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Verifikasi OTP Pemulihan Password Anda",
  html: `
  <body style="margin:0; padding:0; background-color:#f5f7fa; font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto;">
      <tr>
        <td style="padding:40px 0; text-align:center;">
          <a href="#" style="text-decoration:none;">
            <h1 style="color:#2563eb; font-size:24px; margin:0; font-weight:700;"></h1>
          </a>
        </td>
      </tr>

      <tr>
        <td>
          <table width="100%" cellpadding="0" cellspacing="0" 
            style="background-color:#ffffff; border-radius:16px; box-shadow:0 8px 25px rgba(0,0,0,0.05); padding:40px;">
            
            <tr>
              <td style="text-align:center;">
                <h2 style="color:#111827; font-size:22px; margin-bottom:10px;">Hai ${user.name},</h2>
                <p style="color:#374151; font-size:16px; line-height:1.6; margin:0 0 24px;">
                  Kami menerima permintaan untuk <strong>memulihkan password akun Anda</strong>.
                  Gunakan kode verifikasi di bawah ini untuk melanjutkan proses.
                </p>
              </td>
            </tr>

            <tr>
              <td style="text-align:center; padding:24px 0;">
                <div style="display:inline-block; background-color:#f9fafb; border-radius:12px; border:1px solid #e5e7eb; padding:18px 36px;">
                  <span style="font-size:36px; font-weight:700; color:#111827; letter-spacing:6px;">${otp}</span>
                </div>
              </td>
            </tr>

            <tr>
              <td style="text-align:center;">
                <p style="color:#6b7280; font-size:14px; margin:8px 0;">
                  OTP ini berlaku selama <strong>5 menit</strong>.
                </p>
                <p style="color:#9ca3af; font-size:13px; margin-top:16px;">
                  Jika Anda tidak meminta reset password, abaikan email ini.
                  Akun Anda tetap aman 
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding-top:32px; border-top:1px solid #e5e7eb; text-align:center;">
                <p style="color:#9ca3af; font-size:12px; margin-top:16px;">
                  Email ini dikirim secara otomatis oleh sistem <strong></strong>.<br/>
                  Mohon untuk tidak membalas pesan ini.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <tr>
        <td style="text-align:center; padding:24px 0;">
          <p style="color:#9ca3af; font-size:12px;">© ${new Date().getFullYear()} . All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
  `,
      });

    return res.status(200).json({
      status: true,
      success: true,
      message: "OTP berhasil dikirim ke email Anda",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Terjadi kesalahan server", data: null });
  }
}; //termasuk resend otp

export const logout = async (req, res) => {
  const user = req.user.uuid; //middleware auth
  // console.log("cek data dari middleware",user);
  // console.log("route are called ")
  try {
    const token = req.cookies.jwt;  //get cookie
    console.log(token);
    //logot hapus token di db
    const signOut = await prisma.user.updateMany({
      where: {
        uuid: user,
      },
      data: {
        tokenJwt: null,
      },
    });
    if (signOut) {
      res.clearCookie("jwt");
    }
    return res.status(200).json({
      status: true,
      success: true,
      message: "Logout berhasil",
      data: null
    })
    //di fe buang cookie, dan buang refreshToken + token
    //secure store buang 
  } catch (error) {
    return res.status(503).json({
       status: false, 
       message: "Service is busy, please try again later", 
       data: null
       });
  } finally {
    console.log("finnaly eskomedi")
  }
}

export const countUser = async (req, res) => {
  const user = req.user.uuid;
  if (!user) {
    return res.status(409).json({
      status: true,
      success: false,
      message: "Silahkan login terlebih dahulu!",
    });
  }
  try {
    const count = await prisma.user.count();
    const userall = await prisma.user.findMany(
      {
        select: {
          uuid: true,
          name: true,
          email: true,
          phone: true,
       
          plan: true,
          createdAt: true,
        },
      }
    );
    res.json({ success: true, jumlah: count, data: userall });
  } catch (error) {
    console.error("Error countUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//edit user by uuid 
export const editUserAccess = async (req, res) => {
  const userId = req.user.uuid;
  if (!userId) {
    return res.status(409).json({
      status: true,
      success: false,
      message: "Silahkan login terlebih dahulu!",
    });
  }

  const uuidparams = req.params.uuid;
  const { hakAkses } = req.body; // ambil field yang diizinkan

  if (!hakAkses || hakAkses.trim() === "") {
    return res.status(400).json({
      status: false,
      success: false,
      message: "Field 'hakAkses' wajib diisi",
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { uuid: uuidparams } });
    if (!user) {
      return res.status(404).json({
        status: false,
        success: false,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { uuid: uuidparams },
      data: { hakAkses },
    });

    return res.status(200).json({
      status: true,
      success: true,
      message: "Hak akses user berhasil diupdate",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error editUserAccess:", error);
    return res.status(500).json({
      status: false,
      success: false,
      message: "Terjadi kesalahan server",
      data: null,
    });
  }
};

export const deleteUserbyid = async (req, res) => {
  const uuidparams = req.params.uuid;

  try {
    const user = await prisma.user.findUnique({
      where: { uuid: uuidparams },
      select: { id: true, uuid: true, name: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // 🧹 Hapus semua data yang berelasi dengan user.id
    await prisma.follower.deleteMany({
      where: {
        OR: [
          { followingId: user.id },
          { followerId: user.id },
        ],
      },
    });
    await prisma.like.deleteMany({ where: { userId: user.id } }).catch(() => {});
    await prisma.comment.deleteMany({ where: { userId: user.id } }).catch(() => {});
    await prisma.post.deleteMany({ where: { userId: user.id } }).catch(() => {});

    
    await prisma.user.delete({
      where: { uuid: uuidparams },
    });

    return res.status(200).json({
      success: true,
      message: `Berhasil dihapus`,
    });
  } catch (error) {
    console.log("Error deleteUserbyid:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
    });

    const data = await Promise.all(
      transactions.map(async (t) => {
        const user = await prisma.user.findUnique({
          where: { uuid: t.useruuid },
          select: { id: true, name: true, email: true },
        });

        return {
          ...t,
          user,
        };
      })
    );

    res.json({
      success: true,
      message: "Daftar transaksi berhasil diambil",
      data,
    });
  } catch (err) {
    console.error("Error getAllTransactions:", err);
    res.status(500).json({ error: "Gagal mengambil data transaksi" });
  }
};

export const searchTransactions = async (req, res) => {
  const search = (req.params.search || "").toLowerCase().trim();

  if (!search) {
    return res.status(400).json({
      success: false,
      message: "Silahkan masukkan kata kunci pencarian!",
    });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { useruuid: { contains: search } },
          { courseuuid: { contains: search } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      message: "Daftar transaksi berhasil diambil",
      data: transactions,
    });
  } catch (error) {
    console.log("Error searchTransactions:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
}


