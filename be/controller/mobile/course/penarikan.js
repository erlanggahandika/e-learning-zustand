import { PrismaClient } from '@prisma/client';
import snap from '../../../midtrans.js';
import crypto from 'crypto';
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const createWithdrawal = async (req, res) => {
  const userUuid = req.user?.uuid;
  console.log("UUID User:", userUuid);

  if (!userUuid) {
    return res.status(401).json({ success: false, message: "Silahkan login terlebih dahulu!" });
  }

  try {
    const dataUser = await prisma.user.findUnique({ where: { uuid: userUuid } });
    console.log("Data User:", dataUser);

    const { bankName, accountName, accountNumber, amount } = req.body;
    console.log("Request Body:", req.body);

    if (!bankName || !accountName || !accountNumber || !amount) {
      return res.status(400).json({ success: false, message: "Semua field wajib diisi." });
    }

    const mentor = await prisma.mentor.findUnique({ where: { email: dataUser.email } });
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor tidak ditemukan." });

    const balanceNum = Number(mentor.balance);
    const amountNum = Number(amount);
    console.log("Mentor Balance:", balanceNum, "Amount Requested:", amountNum);

    if (balanceNum < amountNum) {
      console.log("Saldo tidak cukup!");
      return res.status(400).json({ success: false, message: "Saldo tidak cukup untuk penarikan." });
    }

    // Buat pengajuan penarikan
    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        mentorId: mentor.id,
        mentorUuid: dataUser.uuid,
        bankName,
        accountName,
        accountNumber,
        amount: amountNum,
      },
    });

    // Kurangi saldo mentor
    await prisma.mentor.update({
      where: { id: mentor.id },
      data: { balance: { decrement: amountNum } },
    });

    // Kirim email ke mentor
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"AjarinAja" <${process.env.EMAIL_USER}>`,
      to: dataUser.email,
      subject: "Pengajuan Penarikan Dana Anda",
      html: `
      <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f5f5f7; color:#1c1c1e;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; padding:20px;">
          <tr>
            <td style="text-align:center; padding:20px 0;">
              <h1 style="margin:0; font-size:28px; font-weight:700; color:#007aff;">AjarinAja</h1>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff; border-radius:16px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
              <h2 style="margin-top:0; font-size:22px; font-weight:600; color:#1c1c1e;">Hai ${mentor.name},</h2>
              <p style="font-size:16px; line-height:1.6; color:#3a3a3c;">
                Kami menerima permintaan penarikan dana Anda sebesar <strong>Rp ${amountNum.toLocaleString()}</strong> ke rekening berikut:
              </p>
              <ul style="font-size:16px; line-height:1.6; color:#3a3a3c; padding-left:20px;">
                <li><strong>Bank:</strong> ${bankName}</li>
                <li><strong>Nama Pemilik:</strong> ${accountName}</li>
                <li><strong>Nomor Rekening:</strong> ${accountNumber}</li>
              </ul>
              <p style="font-size:16px; line-height:1.6; color:#3a3a3c;">
                Status pengajuan: <strong>Diproses</strong>.
              </p>
              <p style="font-size:14px; color:#6b6b70;">Jika Anda tidak mengajukan penarikan ini, segera hubungi tim AjarinAja.</p>
            </td>
          </tr>
          <tr>
            <td style="text-align:center; padding:20px 0; font-size:12px; color:#8e8e93;">
              © ${new Date().getFullYear()} AjarinAja. Semua hak dilindungi.
            </td>
          </tr>
        </table>
      </body>
      `,
    });

    console.log("Withdrawal Created:", withdrawal);
    res.status(201).json({ success: true, message: "Pengajuan penarikan dibuat.", data: withdrawal });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};


// === 2. GET SEMUA PENGAJUAN (UNTUK ADMIN) ===
export const getAllWithdrawals = async (req, res) => {
    const user = req.user.uuid;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Silahkan login terlebih dahulu!",
      });
    }
  try {
    const withdrawals = await prisma.withdrawalRequest.findMany({
      include: { mentor: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: withdrawals });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil data." });
  }
};

// === 3. GET PENGAJUAN PER MENTOR ===
export const getMyWithdrawals = async (req, res) => {
  try {
    const uuid = req.user.uuid;
    if (!uuid) return res.status(404).json({ success: false, message: "User tidak ditemukan." });
    const user = await prisma.user.findUnique({ where: { uuid } });
    if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan." });
    const mentorId = user.id;
    const data = await prisma.withdrawalRequest.findMany({
      where: { mentorUuid: user.uuid },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Gagal mengambil data." });
  }
};

// === 4. UPDATE STATUS + UPLOAD BUKTI (ADMIN) ===
export const updateWithdrawalStatus = async (req, res) => {
  const userUuid = req.user?.uuid;
  if (!userUuid) {
    return res.status(401).json({ success: false, message: "Silahkan login terlebih dahulu!" });
  }

  try {
    const { uuid, status } = req.body;

    // Ambil file image jika ada
    const image = req.files && req.files["image"] ? `/uploads/${req.files["image"][0].filename}` : null;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status wajib diisi." });
    }

    // Update data penarikan
    const withdrawal = await prisma.withdrawalRequest.update({
      where: { uuid },
      data: { status, ...(image && { proofImage: image }) },
      include: { mentor: true },
    });

    // Kirim email kalau status berhasil
    if (status.toLowerCase() === "approved" || status.toLowerCase() === "success") {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"AjarinAja" <${process.env.EMAIL_USER}>`,
        to: withdrawal.mentor.email,
        subject: "Penarikan Dana Berhasil",
        html: `
        <body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f5f5f7; color:#1c1c1e;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; padding:20px;">
            <tr>
              <td style="text-align:center; padding:20px 0;">
                <h1 style="margin:0; font-size:28px; font-weight:700; color:#007aff;">AjarinAja</h1>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff; border-radius:16px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                <h2 style="margin-top:0; font-size:22px; font-weight:600; color:#1c1c1e;">Hai ${withdrawal.mentor.name},</h2>
                <p style="font-size:16px; line-height:1.6; color:#3a3a3c;">
                  Pengajuan penarikan dana Anda sebesar <strong>Rp ${withdrawal.amount.toLocaleString()}</strong> telah berhasil diproses.
                </p>
                <ul style="font-size:16px; line-height:1.6; color:#3a3a3c; padding-left:20px;">
                  <li><strong>Bank:</strong> ${withdrawal.bankName}</li>
                  <li><strong>Nama Pemilik:</strong> ${withdrawal.accountName}</li>
                  <li><strong>Nomor Rekening:</strong> ${withdrawal.accountNumber}</li>
                </ul>
                <p style="font-size:14px; color:#6b6b70;">
                  Silakan cek rekening Anda. Jika ada kendala, segera hubungi tim AjarinAja.
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align:center; padding:20px 0; font-size:12px; color:#8e8e93;">
                © ${new Date().getFullYear()} AjarinAja. Semua hak dilindungi.
              </td>
            </tr>
          </table>
        </body>
        `,
      });
    }

    res.json({ success: true, data: withdrawal });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};