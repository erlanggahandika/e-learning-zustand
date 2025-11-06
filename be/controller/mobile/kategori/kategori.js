import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
const prisma = new PrismaClient();

dotenv.config();
// ===========================
// GET KATEGORI (urut berdasarkan sortOrder)
// ===========================
export const getKategori = async (req, res) => {
  try {
    // Jika pakai middleware auth
    if (!req.user?.uuid) {
      return res.status(401).json({
        status: false,
        success: false,
        message: "Silakan login terlebih dahulu!",
      });
    }

    const data = await prisma.kategoriKursus.findMany({
      orderBy: { sortOrder: "asc" }, // urut dari kecil ke besar
    });

    return res.status(200).json({
      status: true,
      success: true,
      message: "Berhasil mengambil kategori",
      data,
    });
  } catch (error) {
    console.error("Error getKategori:", error);
    return res.status(503).json({
      status: false,
      success: false,
      message: "Gagal mengambil kategori",
    });
  }
};
