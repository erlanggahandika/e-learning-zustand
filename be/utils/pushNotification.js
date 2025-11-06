import { Expo } from 'expo-server-sdk';

//cara pakai notifiasi ini
// import { createNotification } from "../../../service/notificationService.js"; 1
//  await createNotification({ 2
//       title: "Login Berhasil",
//       message: `User ${name || email} berhasil login dari ${deviceInfo}, IP: ${ip}`,
//       type: "Peringatan Login!",
//       email,
//     });
// Buat instance Expo
const expo = new Expo();

export async function sendPushNotification(tokens, message) {
  let notifications = [];

  for (let pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Token ${pushToken} tidak valid`);
      continue;
    }

    notifications.push({
      to: pushToken,
      sound: 'default',
      title: message.title,
      body: message.body,
      data: message.data || {},
    });
  }

  let chunks = expo.chunkPushNotifications(notifications);

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log("tiket notif",ticketChunk);
    } catch (error) {
      console.log(error);
    }
  }
}
