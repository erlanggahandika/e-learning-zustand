import { PrismaClient } from "@prisma/client";
import argon2, { argon2id } from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
import { UAParser } from "ua-parser-js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { parse } from "path";
import { uuid } from "systeminformation";
const prisma = new PrismaClient();

dotenv.config();

export const antekantek = async (req, res) => {
    const user = req.user.uuid 
    if (!user) {
         return res.status(409).json({
            status: true,
            success: false,
            message: "Silahkan login terlebih dahulu!",
        })
    }
    console.log(user)
    //ambl user
    const getToken = await prisma.user.findFirstOrThrow({
        where: {
            uuid: user
        }
    })
    console.log(getToken.token_notification)

    const {token_notification} = req.body
   try {
     if (getToken.token_notification) {
        return res.status(200).json({
            status: true,
            success: false,
            message: "Token telah tersedia",
        })
    }   
    
    if (!getToken.token_notification) {
        await prisma.user.update({
            where: {
                uuid: user
            },
            data: {
                token_notification: token_notification
            }
        })
        return res.status(200).json({
            status: true,
            success: true,
            message: "Berhasil menambah token",
        })
    }
   } catch (error) {
    return res.status(503).json({
        status: false,
        success: false,
        message: "Service sedang sibuk, silahkan coba lagi",
    })
   } finally {
    console.log(`[antekantek] user: ${user} | selesai ${new Date().toISOString()}`);
   }
}

export const statusNotifikasi = async (req, res) => {
    const user = req.user.uuid
    if (!user) {
         return res.status(409).json({
            status: true,
            success: false,
            message: "Silahkan login terlebih dahulu!",
        })
    }
    const getToken = await prisma.user.findFirstOrThrow({
        where: {
            uuid: user
        }
    })
   console.log(getToken.notification_active)

   const status = getToken.notification_active

    try {
        if (getToken.notification_active) {
        return res.status(200).json({
            status: true,
            success: true,
            message: "Notifikasi aktif",
            data: status
        })
    } else {
        return res.status(200).json({
            status: true,
            success: false,
            message: "Notifikasi tidak aktif",
            data: status
        })
    }
    } catch (error) {
        console.log(error)
        return res.status(503).json({
            status: false,
            success: false,
            message: "Service sedang sibuk, silahkan coba lagi",
        })
    }
}

export const getNotifikasi = async (req, res) => {
    const user = req.user.uuid
    if (!user) {
         return res.status(409).json({
            status: true,
            success: false,
            message: "Silahkan login terlebih dahulu!",
        })
    }
    const getToken = await prisma.user.findFirstOrThrow({
        where: {
            uuid: user
        }
    })
    // console.log(getToken.uuid)
    try {
        //ambil data user 
            const getNotif = await prisma.notifikasi.findMany({
                where: {
                    uuid: getToken.uuid
                }
            })
            return res.status(200).json({
                status: true,
                success: true,
                message: "Berhasil mengambil notifikasi",
                data: getNotif
            })
    } catch (error) {
        return res.status(503).json({
            status: false,
            success: false,
            message: "Service sedang sibuk, silahkan coba lagi",
        })
    } finally {
        console.log(`[getNotifikasi] user: ${user} | selesai ${new Date().toISOString()}`);
    }
    
}

export const getNotifikasibyId = async (req, res) => {
  const { id } = req.params;
  const userUuid = req.user.uuid;

  if (!id) {
    return res.status(400).json({
      status: false,
      success: false,
      message: "Notifikasi tidak ditemukan",
      data: null,
    });
  }
  if (!userUuid) {
    return res.status(409).json({
      status: false,
      success: false,
      message: "Silahkan login terlebih dahulu!",
      data: null,
    });
  }

  try {
    //uuid
    const user = await prisma.user.findFirstOrThrow({
      where: { uuid: userUuid },
      select: { email: true },
    });

    // notif
    const notif = await prisma.notifikasi.findFirst({
      where: {
        id: parseInt(id),
        uuid: user.uuid,
      },
    });

    if (!notif) {
      return res.status(404).json({
        status: false,
        success: false,
        message: "Notifikasi tidak ditemukan atau bukan milik user ini",
        data: null,
      });
    }

   // updet isread
    const updatedNotif = await prisma.notifikasi.update({
      where: { id: parseInt(id) },
      data: { isRead: true },
    });

    console.log(updatedNotif.isRead);

    return res.status(200).json({
      status: true,
      success: true,
      message: "Berhasil mengambil notifikasi",
      data: updatedNotif,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({
      status: false,
      success: false,
      message: "Service sedang sibuk, silahkan coba lagi",
    });
  } finally {
    console.log(
      `[getNotifikasi] user: ${userUuid} | selesai ${new Date().toISOString()}`
    );
  }
};

export const updateStatusNotifikasi = async (req, res) => {
    const notification_active = req.body.notification_active
    const user = req.user.uuid
    if (!user) {
         return res.status(409).json({
            status: true,
            success: false,
            message: "Silahkan login terlebih dahulu!",
        })
    }

    console.log(user);
    if (!["active", "nonActive"].includes(notification_active)) {
      return res.status(400).json({
        status: false,
        success: false,
        message: "Status notifikasi tidak valid",
      });
    }
    try {
        await prisma.user.update({
            where: {
                uuid: user
            },
            data: {
                notification_active: notification_active
            }
        })
        return res.status(200).json({
            status: true,
            success: true,
            message: "Berhasil mengubah status notifikasi",
        })
    } catch (error) {
        console.log(error)
        return res.status(503).json({
            status: false,
            success: false,
            message: "Service sedang sibuk, silahkan coba lagi",
        })
    }
}

export const deleteNotificationbyId = async (req, res) => {
  const { id } = req.params;
  const userUuid = req.user.uuid;

  if (!id) {
    return res.status(400).json({
      status: false,
      success: false,
      message: "Notifikasi tidak ditemukan",
      data: null,
    });
  }
  if (!userUuid) {
    return res.status(409).json({
      status: false,
      success: false,
      message: "Silahkan login terlebih dahulu!",
      data: null,
    });
  }

  try {
    //uuid
    const user = await prisma.user.findFirstOrThrow({
      where: { uuid: userUuid },
      select: { email: true },
    });

    // notif
    const notif = await prisma.notifikasi.findFirst({
      where: {
        id: parseInt(id),
        uuid: user.uuid,
      },
    });

    if (!notif) {
      return res.status(404).json({
        status: false,
        success: false,
        message: "Notifikasi tidak ditemukan atau bukan milik user ini",
        data: null,
      });
    }

    await prisma.notifikasi.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      status: true,
      success: true,
      message: "Berhasil menghapus notifikasi",
    });
  } catch (error) {
    console.error(error);
    return res.status(503).json({
      status: false,
      success: false,
      message: "Service sedang sibuk, silahkan coba lagi",
    });
  } finally {
    console.log(
      `[getNotifikasi] user: ${userUuid} | selesai ${new Date().toISOString()}`
    );
  }
}