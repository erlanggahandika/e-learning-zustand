import prisma from "../prisma/index.js";
import { sendPushNotification } from "../utils/pushNotification.js";


//cara pakai notifiasi ini
// import { createNotification } from "../../../service/notificationService.js"; 1
//  await createNotification({ 2
//       title: "Login Berhasil",
//       message: `User ${name || email} berhasil login dari ${deviceInfo}, IP: ${ip}`,
//       type: "Peringatan Login!",
//       email,
//     });
    
export async function createNotification({ title, message, type, email, uuid }) {
  try {
    //  Simpan notifikasi ke database
    const notif = await prisma.notifikasi.create({
      data: { title, message, type, email, uuid },
    });

    //  Ambil data user terkait
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        token_notification: true,
        name: true,
        email: true,
        notification_active: true, // pastikan active/nonActive
      },
    });

    //Cek apakah user ada dan aktif
    if (user && user.notification_active === "active" && user.token_notification) {
      await sendPushNotification([user.token_notification], {
        title: notif.title,
        body: notif.message || `Hai ${user.name || user.email}, ada notifikasi baru.`,
        data: { screen: "Home" },
      });
    } else {
      console.log(
        `[service createNotification] User ${email} nonActive,`
      );
    }

    return notif;
  } catch (error) {
    console.error("[createNotification] Error:", error);
    throw new Error("Gagal membuat notifikasi");
  }
}

export async function createNotificationadmin({ title, message, type, email, uuid }) {
  try {
    //  Simpan notifikasi ke database
    const notif = await prisma.notifikasi.create({
      data: { title, message, type, email, uuid },
    });

    //  Ambil data user terkait
    const user = await prisma.admin.findUnique({
      where: { email },
      select: {
        token_notification: true,
        name: true,
        email: true,
        notification_active: true, // pastikan active/nonActive
      },
    });

    //Cek apakah user ada dan aktif
    if (user && user.notification_active === "active" && user.token_notification) {
      await sendPushNotification([user.token_notification], {
        title: notif.title,
        body: notif.message || `Hai ${user.name || user.email}, ada notifikasi baru.`,
        data: { screen: "Home" },
      });
    } else {
      console.log(
        `[service createNotification] User ${email} nonActive,`
      );
    }

    return notif;
  } catch (error) {
    console.error("[createNotification] Error:", error);
    throw new Error("Gagal membuat notifikasi");
  }
}
