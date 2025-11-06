import express from "express";
import { Limiter, Limiter15, Limiter5, Limiter50, Limiter30 } from "../../../middleware/Limiter.js";
import { authMiddleware } from "../../../middleware/Verify.js";
import { antekantek, statusNotifikasi, getNotifikasi, getNotifikasibyId, deleteNotificationbyId, updateStatusNotifikasi } from "../../../controller/mobile/notification/notifikasi.js";
const router = express.Router();

router.post("/token-notification", Limiter5, authMiddleware, antekantek); //post token notifikasi
/**
 * @swagger
 * /v1/token-notification:
 *   post:
 *     summary: Simpan token notifikasi untuk user (device token)
 *     description: Endpoint ini digunakan untuk menyimpan token notifikasi (misalnya dari Firebase Cloud Messaging) milik user yang sudah login. Jika token sudah pernah disimpan sebelumnya, maka akan mengembalikan pesan bahwa token sudah tersedia.
 *     tags:
 *       - notification member
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token_notification
 *             properties:
 *               token_notification:
 *                 type: string
 *                 example: eQz4m1W3CDEYqR-L6A4DkT:APA91bHXQ7s89m...
 *     responses:
 *       200:
 *         description: Token berhasil ditambahkan atau sudah tersedia
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
 *                   example: Berhasil menambah token
 *       200_existing:
 *         description: Token sudah ada sebelumnya
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token telah tersedia
 *       401:
 *         description: Token JWT tidak valid atau belum login
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
 *                   example: Unauthorized
 *       503:
 *         description: Service sedang sibuk
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
 *                   example: Service sedang sibuk, silahkan coba lagi
 */
router.get("/status-notification", Limiter15, authMiddleware, statusNotifikasi); //cek status notifikasi
/**
 * @swagger
 * /v1/status-notification:
 *   get:
 *     summary: Cek status notifikasi user
 *     description: Endpoint untuk mengecek apakah notifikasi user sedang aktif atau tidak. Memerlukan token JWT (middleware auth).  
 *     tags:
 *       - notification member
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status notifikasi berhasil diambil
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
 *                   example: Notifikasi aktif
 *                 data:
 *                   type: boolean
 *                   example: true
 *       200_inactive:
 *         description: Notifikasi user tidak aktif
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
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Notifikasi tidak aktif
 *                 data:
 *                   type: boolean
 *                   example: false
 *       401:
 *         description: Token JWT tidak valid atau belum login
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
 *                   example: Unauthorized
 *       503:
 *         description: Service sedang sibuk
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
 *                   example: Service sedang sibuk, silahkan coba lagi
 */
router.get("/list-notification", Limiter50, authMiddleware, getNotifikasi); //get notifikasi
/**
 * @swagger
 * /v1/list-notification:
 *   get:
 *     summary: Ambil daftar notifikasi 
 *     description: Endpoint untuk mengambil semua notifikasi milik user yang sedang login. Memerlukan token JWT (middleware auth).
 *     tags:
 *       - notification member
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar notifikasi user
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
 *                   example: Berhasil mengambil notifikasi
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 82
 *                       title:
 *                         type: string
 *                         example: SekolahCasn
 *                       message:
 *                         type: string
 *                         example: Hai, terdapat aktivitas login baru-baru ini.
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *                       type:
 *                         type: string
 *                         example: Peringatan Login!
 *                       email:
 *                         type: string
 *                         example: erlan.2159201068@umko.ac.id
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-06T03:56:56.738Z
 *                       userId:
 *                         type: integer
 *                         nullable: true
 *                         example: null
 *       401:
 *         description: Token JWT tidak valid atau belum login
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
 *                   example: Unauthorized
 *       503:
 *         description: Service sedang sibuk / error dari server
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
 *                   example: Service sedang sibuk, silahkan coba lagi
 */
router.get("/list-notification-byid/:id", Limiter30, authMiddleware, getNotifikasibyId); //get notifikasi
/**
 * @swagger
 * /v1/list-notification-byid/{id}:
 *   get:
 *     summary: Ambil detail notifikasi berdasarkan ID (khusus user yang terautentikasi)
 *     description: "Endpoint ini mengambil detail notifikasi milik user yang sedang login berdasarkan ID notifikasi. Notifikasi akan otomatis ditandai sebagai terbaca (isRead: true)."
 *     tags:
 *       - notification member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "ID notifikasi yang ingin diambil"
 *         schema:
 *           type: integer
 *           example: 82
 *     responses:
 *       200:
 *         description: "Notifikasi berhasil diambil dan diperbarui menjadi terbaca (isRead: true)"
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
 *                   example: "Berhasil mengambil notifikasi"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 82
 *                     title:
 *                       type: string
 *                       example: "SekolahCasn"
 *                     message:
 *                       type: string
 *                       example: "Hai, terdapat aktivitas login baru-baru ini."
 *                     isRead:
 *                       type: boolean
 *                       example: true
 *                     type:
 *                       type: string
 *                       example: "Peringatan Login!"
 *                     email:
 *                       type: string
 *                       example: "erlan.2159201068@umko.ac.id"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-06T03:56:56.738Z"
 *                     userId:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: "ID notifikasi tidak diberikan"
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
 *                   example: "Notifikasi tidak ditemukan"
 *                 data:
 *                   type: object
 *                   example: null
 *       401:
 *         description: "Token JWT tidak valid atau belum login"
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
 *                   example: "Unauthorized"
 *       404:
 *         description: "Notifikasi tidak ditemukan atau bukan milik user ini"
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
 *                   example: "Notifikasi tidak ditemukan atau bukan milik user ini"
 *                 data:
 *                   type: object
 *                   example: null
 *       503:
 *         description: "Service sedang sibuk / error dari server"
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
 *                   example: "Service sedang sibuk, silahkan coba lagi"
 */
router.delete("/delete-notification/:id", Limiter50, authMiddleware, deleteNotificationbyId); //delete notifikasi
/**
 * @swagger
 * /v1/delete-notification/{id}:
 *   delete:
 *     summary: Hapus notifikasi berdasarkan ID (khusus user login)
 *     description: "Endpoint untuk menghapus notifikasi milik user yang sedang login berdasarkan ID. Hanya notifikasi milik user tersebut yang dapat dihapus."
 *     tags:
 *       - notification member
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID notifikasi yang akan dihapus
 *         schema:
 *           type: integer
 *           example: 82
 *     responses:
 *       200:
 *         description: Notifikasi berhasil dihapus
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
 *                   example: Berhasil menghapus notifikasi
 *       400:
 *         description: ID notifikasi tidak valid
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
 *                   example: Notifikasi tidak ditemukan
 *       404:
 *         description: Notifikasi tidak ditemukan
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
 *                   example: Notifikasi tidak ditemukan
 *       409:
 *         description: User belum login
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
 *         description: Service sedang sibuk
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
 *                   example: Service sedang sibuk, silahkan coba lagi
 */
router.patch("/update-status-notification", Limiter15, authMiddleware, updateStatusNotifikasi); //update status notifikasi

export default router;