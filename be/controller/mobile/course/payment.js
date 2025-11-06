import { PrismaClient } from '@prisma/client';
import snap from '../../../midtrans.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const prisma = new PrismaClient();

export const belicourse = async (req, res) => {
  try {
    const userUuid = req.user?.uuid;
    const courseUuid = req.params.uuid;

    if (!userUuid) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { uuid: userUuid } });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const course = await prisma.course.findUnique({ where: { uuid: courseUuid } });
    if (!course) return res.status(404).json({ error: "Course tidak ditemukan" });

    // Cek enrollment
    let enrollment = await prisma.enrollment.findFirst({
      where: { useruuid: userUuid, courseId: course.id },
    });

    if (enrollment) {
      if (enrollment.paid) return res.status(400).json({ message: "Course sudah dibeli" });
    } else {
      enrollment = await prisma.enrollment.create({
        data: { courseId: course.id, useruuid: userUuid, userId: user.id, paid: false },
      });
    }

    // Course gratis
    if (course.price === 0) {
      await prisma.enrollment.update({ where: { id: enrollment.id }, data: { paid: true } });
      // Kirim email ke user
      await sendPurchaseEmail(user.email, user.name, course.title, 0, true);
      return res.json({ enrollment, message: "Course gratis, tidak perlu pembayaran" });
    }

    // Generate orderId & snapToken
    const orderId = `course-${enrollment.id}-${Date.now()}`;
    await prisma.enrollment.update({ where: { id: enrollment.id }, data: { midtransOrderId: orderId } });

    const parameter = {
      transaction_details: { order_id: orderId, gross_amount: course.price },
      customer_details: { first_name: user.name || "User", email: user.email },
      item_details: [{ id: `course-${course.id}`, price: course.price, quantity: 1, name: course.title }],
      bank_transfer: { bank: "bca" },
    };

    const midtransResponse = await snap.createTransaction(parameter);
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { snapToken: midtransResponse.token, snapUrl: midtransResponse.redirect_url },
    });

    // Kirim email ke user
    await sendPurchaseEmail(user.email, user.name, course.title, course.price, false, midtransResponse.redirect_url);

    res.status(201).json({
      success: true,
      message: "Payment created",
      enrollment,
      snapToken: { token: midtransResponse.token, redirect_url: midtransResponse.redirect_url },
    });
  } catch (err) {
    console.log("Error belicourse:", err);
    res.status(500).json({ error: "Gagal membuat pembayaran", details: err.message });
  }
};

// Fungsi helper kirim email
const sendPurchaseEmail = async (email, name, courseTitle, amount, isFree = false, paymentUrl = "") => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const subject = isFree
    ? `Course ${courseTitle} Gratis`
    : `Konfirmasi Pembelian Course ${courseTitle}`;

  const html = `
  <body style="margin:0; padding:0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#f5f5f7; color:#1c1c1e;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; padding:20px;">
      <tr><td style="text-align:center; padding:20px 0;"><h1 style="margin:0; font-size:28px; font-weight:700; color:#007aff;">AjarinAja</h1></td></tr>
      <tr>
        <td style="background:#ffffff; border-radius:16px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="margin-top:0; font-size:22px; font-weight:600;">Hai ${name},</h2>
          <p style="font-size:16px; line-height:1.6;">
            Kamu ${isFree ? "telah berhasil mendaftar" : "sedang melakukan pembayaran"} untuk course <strong>${courseTitle}</strong>.
          </p>
          ${!isFree ? `<p style="font-size:16px; line-height:1.6;">Jumlah pembayaran: <strong>Rp ${amount.toLocaleString()}</strong></p>
            <p><a href="${paymentUrl}" style="display:inline-block; padding:12px 24px; background:#007aff; color:white; border-radius:8px; text-decoration:none;">Lanjutkan Pembayaran</a></p>` : ""}
          <p style="font-size:14px; color:#6b6b70;">Terima kasih telah menggunakan AjarinAja.</p>
        </td>
      </tr>
      <tr><td style="text-align:center; padding:20px 0; font-size:12px; color:#8e8e93;">© ${new Date().getFullYear()} AjarinAja. Semua hak dilindungi.</td></tr>
    </table>
  </body>
  `;

  await transporter.sendMail({ from: `"AjarinAja" <${process.env.EMAIL_USER}>`, to: email, subject, html });
};


// export const belicourse = async (req, res) => {
//   try {
//     const userUuid = req.user?.uuid;
//     const courseUuid = req.params.uuid;

//     if (!userUuid) {
//       console.log("Unauthorized: user uuid tidak ada");
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const user = await prisma.user.findUnique({ where: { uuid: userUuid } });
//     if (!user) {
//       console.log(`User dengan uuid ${userUuid} tidak ditemukan`);
//       return res.status(404).json({ error: "User tidak ditemukan" });
//     }

//     const course = await prisma.course.findUnique({ where: { uuid: courseUuid } });
//     if (!course) {
//       console.log(`Course dengan uuid ${courseUuid} tidak ditemukan`);
//       return res.status(404).json({ error: "Course tidak ditemukan" });
//     }

//     // Cek apakah user sudah beli
//     let enrollment = await prisma.enrollment.findFirst({
//       where: { useruuid: userUuid, courseId: course.id },
//     });

//     if (enrollment) {
//       if (enrollment.paid) {
//         console.log(`User ${userUuid} sudah membeli course ${courseUuid}`);
//         return res.status(400).json({ message: "Course sudah dibeli" });
//       } else {
//         console.log(`Enrollment pending ditemukan: id ${enrollment.id}`);
//       }
//     } else {
//       // Buat enrollment baru
//        enrollment = await prisma.enrollment.create({
//             data: {
//                 courseId: course.id,
//                 useruuid: userUuid,
//                 userId: user.id,
//                 paid: false,
//             },
//             });

//       console.log(`Enrollment baru dibuat: id ${enrollment.id}`);
//     }

//     // Jika course gratis
//     if (course.price === 0) {
//       console.log("Course gratis, langsung aktif tanpa pembayaran");
//       await prisma.enrollment.update({
//         where: { id: enrollment.id },
//         data: { paid: true },
//       });
//       return res.json({
//         enrollment,
//         message: "Course gratis, tidak perlu pembayaran",
//       });
//     }
//     const orderId = `course-${enrollment.id}-${Date.now()}`;
//     await prisma.enrollment.update({
//     where: { id: enrollment.id },
//     data: { midtransOrderId: orderId },
//   });
//     // Generate snapToken jika belum ada
//     let snapToken = enrollment.snapToken;
//     if (!snapToken) {
//       console.log("Membuat snapToken baru...");
//       const parameter = {
//         transaction_details: {
//           order_id: orderId,
//           gross_amount: course.price,
//         },
//         customer_details: {
//           first_name: user.name || "User",
//           email: user.email,
//         },
//         item_details: [
//           {
//             id: `course-${course.id}`,
//             price: course.price,
//             quantity: 1,
//             name: course.title,
//           },
//         ],
//         bank_transfer: {
//           bank: "bca", // bisa bca, mandiri, bri, dll
//         },
//       };

//       const midtransResponse = await snap.createTransaction(parameter);

//       // Simpan snapToken ke enrollment
//       await prisma.enrollment.update({
//         where: { id: enrollment.id },
//         data: {
//           snapToken: midtransResponse.token,
//           snapUrl: midtransResponse.redirect_url,
//         },
//       });
//       console.log(`SnapToken disimpan: ${midtransResponse.token}`);

//       snapToken = midtransResponse;
//     } else {
//       console.log(`Menggunakan snapToken lama: ${snapToken}`);
//     }

//     res.status(201).json({
//       success: true,
//       message: "Payment created",
//       enrollment,
//       snapToken: {
//         token: enrollment.snapToken || snapToken.token,
//         redirect_url: enrollment.snapUrl || snapToken.redirect_url,
//       },
//     });
//   } catch (err) {
//     console.log("Error belicourse:", err);
//     res.status(500).json({
//       error: "Gagal membuat pembayaran",
//       details: err.message,
//     });
//   }
// };


export const midtransWebhook = async (req, res) => {
  console.log("✅ Webhook diterima");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  try {
    const body = req.body;
    const signatureKey = body.signature_key;

    // Validasi signature
    const expectedSignature = crypto
      .createHash("sha512")
      .update(
        body.order_id + body.status_code + body.gross_amount + process.env.MIDTRANS_SERVER_KEY
      )
      .digest("hex");

    if (signatureKey !== expectedSignature) {
      console.log("❌ Signature tidak valid");
      return res.status(403).send("Invalid signature");
    }

    // Cari enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: { midtransOrderId: body.order_id },
    });

    if (!enrollment) {
      console.log(`⚠️ Enrollment dengan order_id ${body.order_id} tidak ditemukan`);
      return res.status(200).send("Enrollment not found, ignored");
    }

    // Hanya proses jika pembayaran sukses
    if (["capture", "settlement"].includes(body.transaction_status)) {
      // Update enrollment paid
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { paid: true },
      });

      // Ambil course & mentor
      const course = await prisma.course.findUnique({ where: { id: enrollment.courseId } });
      if (!course) return res.status(200).send("Course not found, ignored");

      const mentor = await prisma.mentor.findUnique({ where: { id: course.mentorId } });
      if (!mentor) return res.status(200).send("Mentor not found, ignored");

      // Hitung profit
      const mentorShare = Math.round(course.price * 0.9);
      const adminShare = course.price - mentorShare;

      // Update saldo admin & mentor
      await prisma.admin.update({ where: { id: 1 }, data: { balance: { increment: adminShare } } });
      await prisma.mentor.update({ where: { id: mentor.id }, data: { balance: mentor.balance + mentorShare } });

      // Catat transaksi
      await prisma.transaction.create({
        data: {
          mentorId: mentor.id,
          amount: mentorShare,
          courseId: course.id,
          useruuid: enrollment.useruuid,
          type: "credit",
          snapUrl: enrollment.snapUrl,
          description: `Pembelian course ${course.title}`,
          status: "success",
        },
      });

      await prisma.transaction.create({
        data: {
          mentorId: null,
          amount: adminShare,
          isAdmin: true,
          courseId: course.id,
          useruuid: enrollment.useruuid,
          type: "credit",
          description: `Pembelian course ${course.title} (admin share)`,
          status: "success",
        },
      });

      // === Kirim email ke mentor ===
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"AjarinAja" <${process.env.EMAIL_USER}>`,
        to: mentor.email,
        subject: `Pembelian Course ${course.title} Berhasil`,
        html: `
          <body style="margin:0; padding:0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#f5f5f7; color:#1c1c1e;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; padding:20px;">
              <tr>
                <td style="text-align:center; padding:20px 0;">
                  <h1 style="margin:0; font-size:28px; font-weight:700; color:#007aff;">AjarinAja</h1>
                </td>
              </tr>
              <tr>
                <td style="background:#ffffff; border-radius:16px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
                  <h2 style="margin-top:0; font-size:22px; font-weight:600;">Hai ${mentor.name},</h2>
                  <p style="font-size:16px; line-height:1.6;">
                    Kamu baru saja menerima pembayaran sebesar <strong>Rp ${mentorShare.toLocaleString()}</strong> dari penjualan course <strong>${course.title}</strong>.
                  </p>
                  <p style="font-size:14px; color:#6b6b70;">
                    Silakan cek saldo mentor di dashboard kamu. Terima kasih telah menjadi bagian dari AjarinAja.
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

      // Ambil data user/pembeli
const user = await prisma.user.findUnique({
  where: { uuid: enrollment.useruuid }, // atau id: enrollment.userId
});
if (!user) {
  console.log(`⚠️ User dengan UUID ${enrollment.useruuid} tidak ditemukan`);
} else {
  // Kirim email ke user.email
  await transporter.sendMail({
    from: `"AjarinAja" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Pembelian Course ${course.title} Berhasil`,
    html: `
      <body style="margin:0; padding:0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#f5f5f7; color:#1c1c1e;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; padding:20px;">
          <tr>
            <td style="text-align:center; padding:20px 0;">
              <h1 style="margin:0; font-size:28px; font-weight:700; color:#007aff;">AjarinAja</h1>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff; border-radius:16px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
              <h2 style="margin-top:0; font-size:22px; font-weight:600;">Hai ${user.name},</h2>
              <p style="font-size:16px; line-height:1.6;">
                Pembelian course <strong>${course.title}</strong> berhasil! Total pembayaran: <strong>Rp ${course.price.toLocaleString()}</strong>.
              </p>
              <p style="font-size:14px; color:#6b6b70;">
                Course kamu sudah aktif. Silakan mulai belajar di dashboard AjarinAja.
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
  console.log(`✅ Email dikirim ke user ${user.email}`);
}


      console.log(`✅ Email dikirim ke mentor ${mentor.email}`);
      console.log(`✅ Pembayaran course ${course.title} berhasil diproses`);
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("❌ Error di webhook Midtrans:", err);
    res.status(500).send("Internal server error");
  }
};






