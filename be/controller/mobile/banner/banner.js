import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
const prisma = new PrismaClient();

dotenv.config();

export const getBanner = async (req, res) => {
    const user = req.user.uuid
    if (!user) {
      return res.status(401).json({
        status: false,
        success: false,
        message: "Silahkan login terlebih dahulu!",
      });
    }
    try {
      const banner = await prisma.banner.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      })
      console.log("get banner",banner);
      return res.status(200).json({
        status: true,
        success: true,
        message: "Berhasil mengambil banner",
        data: banner
      })
    } catch (error) {
      console.error("Error fetching banners:", error);
      return res.status(500).json({
        status: false,
        success: false,
        message: "Gagal mengambil banner",
      });
    }
};