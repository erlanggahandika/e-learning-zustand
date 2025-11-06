import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendOtpEvent = async (email, name, otp) => {
  try {
    const verifyUrl = `${process.env.backendUrl || "http://localhost:3000"}/verify?email=${encodeURIComponent(email)}&kode=${otp}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Sekolahcasn" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verifikasi Akun Anda",
      html: `
        <h3>Halo ${name},</h3>
        <p>Terima kasih sudah mendaftar. Berikut adalah kode verifikasi akun Anda:</p>
        <div style="
          font-size: 22px;
          font-weight: bold;
          letter-spacing: 4px;
          margin: 16px 0;
          color: #2b6cb0;
        ">${otp}</div>
        <p>Kode ini hanya berlaku selama <b>20 menit</b>.</p>
        <p>Atau klik tombol di bawah ini untuk verifikasi otomatis:</p>
        <a href="${verifyUrl}" style="
          display:inline-block;
          padding:12px 20px;
          background:#2b6cb0;
          color:white;
          text-decoration:none;
          font-weight:bold;
          border-radius:8px;
        ">Verifikasi Sekarang</a>
        <p>Jika kamu tidak merasa mendaftar, abaikan email ini.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email verifikasi terkirim ke ${email}`);
  } catch (error) {
    console.error("Gagal mengirim email OTP:", error);
  }
};

export const berhasilRegister = async (email, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

  const mailOptions = {
  from: `"Sekolahcasn" <noreply@sekolahcasn.id>`,
  to: email,
  subject: "Selamat! Pendaftaran Berhasil",
  html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">

      <!-- Greeting -->
      <h2 style="color: #111; font-size: 22px; margin-bottom: 16px;">Halo ${name},</h2>

      <!-- Body -->
      <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Selamat! Akun Anda berhasil dibuat di <strong>Sekolahcasn.id</strong>.
      </p>

      <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
        Sekarang Anda bisa masuk dan mulai menikmati semua fitur yang tersedia.
      </p>

     

      <!-- Footer -->
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

      <p style="color: #999; font-size: 13px; line-height: 1.5; text-align: center; margin-bottom: 5px;">
        Anda menerima email ini karena mendaftar di <strong>Sekolahcasn.id</strong>.
      </p>
      <p style="color: #999; font-size: 13px; line-height: 1.5; text-align: center; margin-bottom: 5px;">
        Jika Anda tidak mendaftar, abaikan email ini.
      </p>
      <p style="color: #999; font-size: 13px; line-height: 1.5; text-align: center;">
        &copy; ${new Date().getFullYear()} Sekolahcasn. Semua hak cipta dilindungi.
      </p>
    </div>
  `,
};


    const info = await transporter.sendMail(mailOptions);
    console.log("Email berhasil dikirim:", info.messageId);
    return true;
  } catch (error) {
    console.error("Gagal mengirim email:", error);
    return false;
  }
};
