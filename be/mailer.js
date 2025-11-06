import nodemailer from "nodemailer";

// Buat transporter email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adaabsen@gmail.com",
    pass: "upns wpzu whxr xbpn", // Gunakan App Password, bukan password akun biasa
  },
});

/**
 * Mengirim email notifikasi rollback container.
 * @param {string} containerName - Nama container yang di-rollback
 * @param {string} backupImage - Image backup yang digunakan untuk rollback
 */
export function sendRollbackEmail(containerName, backupImage) {
  const mailOptions = {
    from: '"DockerPilot Notifier" <adaabsen@gmail.com>',
    to: "erlanggahandika73@gmail.com",
    subject: `🔁 Rollback Berhasil: ${containerName}`,
    text: `Container "${containerName}" berhasil di-rollback ke image "${backupImage}".`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Gagal mengirim email rollback:", error.message);
    } else {
      console.log("Notifikasi rollback berhasil dikirim:", info.response);
    }
  });
}


export function sendEmailAlert(containerName, cpuUsage, memoryUsage) {
  const mailOptions = {
    from: '"DockerPilot Alert" <adaabsen@gmail.com>',
    to: "erlanggahandika73@gmail.com",
    subject: `⚠ High Resource Alert: ${containerName}`,
    html: `
      <h3> High Resource Usage Detected</h3>
      <p><strong>Container:</strong> ${containerName}</p>
      <p><strong>CPU Usage:</strong> ${cpuUsage}%</p>
      <p><strong>Memory Usage:</strong> ${memoryUsage}%</p>
      <p>Resource limits have been adjusted automatically.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error("Email gagal:", error.message);
    else console.log("Email alert terkirim:", info.response);
  });
}



