import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
const prisma = new PrismaClient();

dotenv.config();

export const getListLogin = async (req, res) => {
   const uuid = req.user.uuid;
//    console.log(uuid)

  if (!uuid) {
    return res.status(409).json({
      status: false,
      success: false,
      message: "Silahkan login terlebih dahulu!",
      data: null,
    });
  }
try {
    const getData = await prisma.loginActivity.findMany({
        where: {
           userUuid: uuid
        },
       select: {
        userUuid: true,
        ipAddress: true,
        deviceInfo: true,
        location: true,
        status: true,
        loginMethod: true,
        loginTime: true,
        createdAt: true,
       },
       orderBy: {
        loginTime: 'desc', 
       }
    })

    return res.status(200).json({
        status: true,
        success: true,
        message: "Berhasil mengambil data",
        data: getData
    })

} catch (error) {
    return res.status(503).json({
        status: false,
        success: false,
        message: "Service sedang sibuk, silahkan coba lagi",
    })
}
};