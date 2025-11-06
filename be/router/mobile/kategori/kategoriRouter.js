import express from "express";
import { authMiddleware } from "../../../middleware/Verify.js";
import { getKategori } from "../../../controller/mobile/kategori/kategori.js";

const router = express.Router();

router.get("/kategori-kursus", authMiddleware, getKategori);
/**
 * @swagger
 * /v1/kategori-kursus:
 *   get:
 *     summary: Mendapatkan daftar kategori kursus
 *     description: Mengambil seluruh data kategori kursus dari database. Hanya dapat diakses oleh pengguna yang sudah login (autentikasi JWT diperlukan).
 *     tags:
 *       - kategori
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar kategori kursus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Berhasil mengambil kategori
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       namaKategori:
 *                         type: string
 *                         example: "Teknologi Informasi"
 *                       deskripsi:
 *                         type: string
 *                         example: "Kategori untuk kursus seputar pemrograman, desain, dan teknologi."
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-08T09:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-08T09:00:00.000Z"
 *       401:
 *         description: Pengguna belum login atau token tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Silahkan login terlebih dahulu!
 *       503:
 *         description: Gagal mengambil data kategori karena server sibuk atau error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Gagal mengambil kategori
 */

export default router;