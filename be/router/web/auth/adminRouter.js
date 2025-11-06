import express from "express";
import { Limiter, Limiter2, Limiter20 , Limiter30, Limiter50, Limiter5, Limiter15, Limiter10, Limiter8} from "../../../middleware/Limiter.js";
import { authMiddleware, authadmin } from "../../../middleware/Verify.js";
import { loginBase, 
    getProfile, 
    registerBase, 
    verifyOtp, 
    verifyOtpViaLink,
    recoveryPassword,
    validateRecoveryPassword, 
    resetPassword,
    resendRecoveryPasswordOtp,
    changePassword,
    kelolaProfile,
    refreshToken,
    recoveryPasswordsudahlogin,
    logout,
    countUser,
    resendRegisterOtp,  
  editUserAccess,
  getAllSubscriptions,
  getAllTransactions,
  searchUser,
deleteUserbyid  } from "../../../controller/web/auth/authadmin.js";
import {
    getListLogin
} from "../../../controller/mobile/oauth/loginInformation.js";

import {
  getDatasaldoadmin,
  getdatamentor,
  totalseluruhsaldo
} from "../../../controller/mobile/course/course.js";
import {
   getAllWithdrawals,
   updateWithdrawalStatus
} from "../../../controller/mobile/course/penarikan.js";
import { upload } from "../../../middleware/Upload.js";
import router from "../routeradmin/routeradmin.js";

const routerauth = express.Router();
const logMiddleware = (req, res, next) => {
  console.log("Incoming request (profile):", req.method, req.url);
  next();
};
routerauth.post("/register", Limiter8, registerBase);
/**
 * @swagger 
 * /register:
 *   post:
 *     summary: Register
 *     tags:
 *       - auth admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: erlangga
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Pendaftaran berhasil, silahkan periksa email untuk verifikas
 */
routerauth.post("/verifykode", Limiter8, verifyOtp); //verif kode otp regis
/**
 * @swagger
 * /verifykode:
 *   post:
 *     summary: Verifikasi registrasi
 *     description: Endpoint untuk memverifikasi kode OTP registrasi user. Jika berhasil, user baru akan dibuat.
 *     tags:
 *       - auth admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp_code
 *             properties:
 *               email:
 *                 type: string
 *                 example: erlanggahandika73@gmail.com
 *               otp_code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP berhasil diverifikasi, user berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP berhasil diverifikasi
 *                 data:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       example: f9e549ba-3064-44f5-8809-5f5c9bfe34e3
 *                     email:
 *                       type: string
 *                       example: erlanggahandika73@gmail.com
 *                     name:
 *                       type: string
 *                       example: Erlangga
 *       400:
 *         description: OTP salah atau tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: OTP salah
 *       401:
 *         description: Unauthorized (jika ada proteksi tambahan)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token tidak valid
 *       429:
 *         description: Terlalu banyak request (rate limit)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Terlalu banyak request, coba lagi nanti
 *       500:
 *         description: Error dari server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
routerauth.post("/resend-register-otp", Limiter20, resendRegisterOtp); //resend otp register
/**
 * @swagger
 * /resend-register-otp:
 *   post:
 *     summary: Kirim ulang OTP registrasi
 *     description: Endpoint untuk mengirim ulang OTP ke email user yang sudah mendaftar tapi belum verifikasi. Ada cooldown 2 menit sebelum bisa meminta ulang OTP baru.
 *     tags:
 *       - auth admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: erlanggahandika73@gmail.com
 *     responses:
 *       200:
 *         description: OTP berhasil dikirim ulang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP berhasil dikirim ulang, silakan periksa email Anda.
 *       400:
 *         description: Request tidak valid (email kosong atau format salah)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Format email tidak valid
 *       404:
 *         description: Email belum terdaftar di tabel register
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Email belum terdaftar
 *       429:
 *         description: Terlalu cepat meminta OTP baru (cooldown 2 menit)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Tunggu 2 menit sebelum minta OTP baru.
 *       500:
 *         description: Error server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Terjadi kesalahan server
 */
routerauth.post("/sign-in", Limiter20, loginBase);
/**
 * @swagger
 * /sign-in:
 *   post:
 *     summary: Login
 *     tags:
 *       - auth admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: erlan.2159201068@umko.ac.id
 *               password:
 *                 type: string
 *                 example: angga123
 *     responses:
 *       200:
 *         description: Login berhasil
 */

routerauth.get("/profile", Limiter50 , authadmin, logMiddleware, getProfile);
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Ambil data profile user
 *     tags:
 *       - auth admin
 *     security:
 *       - bearerAuth: []  
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       example: f9e549ba-3064-44f5-8809-5f5c9bfe34e3
 *                     name:
 *                       type: string
 *                       example: erlangga
 *                     email:
 *                       type: string
 *                       example: erlanggahandika73@gmail.com
 *       401:
 *         description: Unauthorized, token tidak valid atau tidak dikirim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token tidak valid
 *       429:
 *         description: Terlalu banyak request (rate limit)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Terlalu banyak request, coba lagi nanti
 */
routerauth.delete("/sign-out",Limiter5, authadmin, logout);
/**
 * @swagger
 * /sign-out:
 *   delete:
 *     summary: Logout pengguna dari sistem
 *     description: Endpoint ini digunakan untuk melakukan logout pengguna yang sedang login. Akan menghapus JWT refresh token dari database dan cookie, sehingga pengguna harus login ulang untuk mendapatkan akses baru.
 *     tags:
 *       - auth admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil dilakukan
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
 *                   example: Logout berhasil
 *                 data:
 *                   type: object
 *                   example: null
 *       401:
 *         description: Token JWT tidak valid atau pengguna belum login
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
 *                 data:
 *                   type: object
 *                   example: null
 *       429:
 *         description: Terlalu banyak permintaan (dibatasi oleh limiter)
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
 *                   example: Terlalu banyak permintaan, coba lagi nanti
 *                 data:
 *                   type: object
 *                   example: null
 *       503:
 *         description: Server sedang sibuk atau terjadi kesalahan
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
 *                   example: Service is busy, please try again later
 *                 data:
 *                   type: object
 *                   example: null
 */
routerauth.post("/recovery-password", Limiter20, recoveryPassword); //search by email
/**
 * @swagger
 * /recovery-password:
 *   post:
 *     summary: Request OTP untuk recovery password
 *     description: Kirim email OTP untuk reset password. OTP hanya bisa diminta kembali setelah 2 menit, dan berlaku 5 menit.
 *     tags:
 *       - auth admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: erlanggahandika73@gmail.com
 *     responses:
 *       200:
 *         description: OTP berhasil dikirim ke email
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
 *                   example: OTP berhasil dikirim ke email Anda
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Field kosong atau format email tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Format email tidak valid
 *                 data:
 *                   type: object
 *                   example: null
 *       404:
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User tidak ditemukan
 *                 data:
 *                   type: object
 *                   example: null
 *       429:
 *         description: Terlalu sering request OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Tunggu 60 detik sebelum meminta OTP baru
 *                 data:
 *                   type: object
 *                   example: null
 *       500:
 *         description: Error server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Terjadi kesalahan server
 *                 data:
 *                   type: object
 *                   example: null
 */
routerauth.post("/validate-recovery-password", Limiter20, validateRecoveryPassword); //validate token
/**
 * @swagger
 * /validate-recovery-password:
 *   post:
 *     summary: Validasi OTP untuk recovery password
 *     description: Validasi OTP yang dikirim ke email user. Jika valid, server akan mengembalikan recovery_token yang berlaku 10 menit, recovery token berfungsi mereset password.
 *     tags:
 *       - auth admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp_code
 *             properties:
 *               email:
 *                 type: string
 *                 example: erlanggahandika73@gmail.com
 *               otp_code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP valid, recovery_token dibuat
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
 *                   example: OTP valid, recovery token berhasil dibuat
 *                 data:
 *                   type: object
 *                   properties:
 *                     recovery_token:
 *                       type: string
 *                       example: 7f9a2c3d4e5f6a7b8c9d0e1f2a3b4c5d
 *                     expires_in:
 *                       type: integer
 *                       example: 600
 *       400:
 *         description: OTP salah atau sudah kadaluarsa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: OTP tidak valid atau sudah kadaluarsa
 *                 data:
 *                   type: object
 *                   example: null
 *       500:
 *         description: Error server
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
 *                   example: Terjadi kesalahan server
 *                 data:
 *                   type: object
 *                   example: null
 */
routerauth.post("/reset-password", Limiter20, resetPassword); //reset password
/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset password dengan recovery token
 *     description: Reset password user menggunakan recovery_token yang valid (token ini didapat dari validasi OTP).
 *     tags:
 *       - auth admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recovery_token
 *               - password
 *             properties:
 *               recovery_token:
 *                 type: string
 *                 example: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "PasswordBaru@123"
 *     responses:
 *       200:
 *         description: Password berhasil diubah
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
 *                   example: Password berhasil diubah
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Recovery token tidak valid atau kadaluarsa
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
 *                   example: Ulangi sesi anda untuk mereset password
 *                 data:
 *                   type: object
 *                   example: null
 *       500:
 *         description: Terjadi kesalahan server
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
 *                   example: Terjadi kesalahan server
 *                 data:
 *                   type: object
 *                   example: null
 */
routerauth.post("/resendRecoveryPasswordOtp", Limiter20, resendRecoveryPasswordOtp); //resend otp recovery pass
/**
 * @swagger
 * /resendRecoveryPasswordOtp:
 *   post:
 *     summary: Kirim ulang OTP recovery password
 *     description: Endpoint untuk mengirim ulang OTP recovery password ke email user dengan cooldown 2 menit. OTP berlaku selama 5 menit.
 *     tags:
 *       - auth admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: erlanggahandika73@gmail.com
 *     responses:
 *       200:
 *         description: OTP recovery password berhasil dikirim ulang
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
 *                   example: OTP recovery password berhasil dikirim ulang
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Request tidak valid (email kosong atau format salah)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Format email tidak valid
 *                 data:
 *                   type: object
 *                   example: null
 *       404:
 *         description: User dengan email tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User tidak ditemukan
 *                 data:
 *                   type: object
 *                   example: null
 *       429:
 *         description: Terlalu cepat meminta OTP baru (cooldown 2 menit)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Tunggu 90 detik sebelum meminta OTP baru
 *                 data:
 *                   type: object
 *                   example: null
 *       500:
 *         description: Error server
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
 *                   example: Terjadi kesalahan server
 *                 data:
 *                   type: object
 *                   example: null
 */
routerauth.patch("/change-password", Limiter20, authadmin, changePassword); //sudah login
/**
 * @swagger
 * /change-password:
 *   patch:
 *     summary: Ubah password user (sudah login)
 *     description: Endpoint untuk mengubah password user yang sudah login. User harus mengirim password lama dan password baru. Token JWT dibutuhkan (middleware auth).
 *     tags:
 *       - auth admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - password
 *             properties:
 *               old_password:
 *                 type: string
 *                 example: oldPassword123
 *               password:
 *                 type: string
 *                 example: newPassword123!
 *     responses:
 *       200:
 *         description: Password berhasil diubah
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
 *                   example: Password berhasil diubah
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Password lama salah atau request tidak valid
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
 *                   example: Password lama salah
 *                 data:
 *                   type: object
 *                   example: null
 *       404:
 *         description: User tidak ditemukan
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
 *                   example: User tidak ditemukan
 *                 data:
 *                   type: object
 *                   example: null
 *       500:
 *         description: Terjadi kesalahan server
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
 *                   example: Terjadi kesalahan server
 *                 data:
 *                   type: object
 *                   example: null
 */
routerauth.patch("/edit-profile", Limiter15, authadmin,upload.fields([
    { name: "image", maxCount: 1 },
  ]), kelolaProfile); //edit profile
/**
 * @swagger
 * /edit-profile:
 *   patch:
 *     summary: Edit profil user (sudah login)
 *     description: Endpoint untuk mengubah profil user yang sudah login. Hanya dapat digunakan setelah login (memerlukan JWT token). Setelah berhasil, sistem juga mengirimkan notifikasi "Profile berhasil diubah".
 *     tags:
 *       - auth admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: erlangga
 *               phone:
 *                 type: string
 *                 example: "081234567890"
 *               email:
 *                 type: string
 *                 example: erlangga@gmail.com
 *     responses:
 *       200:
 *         description: Profil berhasil diubah
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
 *                   example: Profile berhasil diubah
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Request tidak valid
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
 *                   example: Data tidak valid
 *                 data:
 *                   type: object
 *                   example: null
 *       404:
 *         description: User tidak ditemukan
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
 *                   example: User tidak ditemukan
 *                 data:
 *                   type: object
 *                   example: null
 *       500:
 *         description: Terjadi kesalahan server
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
 *                   example: Terjadi kesalahan server
 *                 data:
 *                   type: object
 *                   example: null
 */
routerauth.post("/refresh-token", refreshToken);
/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: |
 *       Endpoint untuk memperbarui access token menggunakan refresh token.  
 *       Bisa dipakai saat access token expired.  
 *       Refresh token dikirim melalui header `x-refresh-token` atau cookie `jwt`.  
 *       Jika refresh token hampir expired (< 2 hari), sistem juga membuat refresh token baru.
 *     tags:
 *       - auth admin
 *     parameters:
 *       - in: header
 *         name: x-refresh-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token yang didapat saat login
 *     responses:
 *       200:
 *         description: Token berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Access & refresh token diperbarui
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Token tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token tidak ditemukan
 *       403:
 *         description: Token tidak valid atau expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Refresh token tidak valid atau expired
 */
routerauth.post("/recovery-password-sudah-login", Limiter20, authadmin, recoveryPasswordsudahlogin);
/**
 * @swagger
 * /recovery-password-sudah-login:
 *   post:
 *     summary: Request OTP untuk recovery password
 *     description: Kirim email OTP untuk reset password. OTP hanya bisa diminta kembali setelah 2 menit, dan berlaku 5 menit.
 *     tags:
 *       - auth admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: erlanggahandika73@gmail.com
 *     responses:
 *       200:
 *         description: OTP berhasil dikirim ke email
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
 *                   example: OTP berhasil dikirim ke email Anda
 *                 data:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Field kosong atau format email tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Format email tidak valid
 *                 data:
 *                   type: object
 *                   example: null
 *       404:
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User tidak ditemukan
 *                 data:
 *                   type: object
 *                   example: null
 *       429:
 *         description: Terlalu sering request OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Tunggu 60 detik sebelum meminta OTP baru
 *                 data:
 *                   type: object
 *                   example: null
 *       500:
 *         description: Error server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Terjadi kesalahan server
 *                 data:
 *                   type: object
 *                   example: null
 */
routerauth.get("/list-info-login",Limiter30, authadmin, getListLogin);
/**
 * @swagger
 * /list-info-login:
 *   get:
 *     summary: Mendapatkan riwayat aktivitas login pengguna
 *     description: Endpoint ini digunakan untuk mengambil daftar aktivitas login berdasarkan UUID pengguna yang sedang login. Hanya bisa diakses setelah autentikasi JWT (melalui `authadmin`).
 *     tags:
 *       - auth admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar aktivitas login pengguna
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
 *                   example: Berhasil mengambil data
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userUuid:
 *                         type: string
 *                         example: "f4e1b7d0-45c6-4c58-9b0f-9a8d3c291234"
 *                       ipAddress:
 *                         type: string
 *                         example: "192.168.1.10"
 *                       deviceInfo:
 *                         type: string
 *                         example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
 *                       location:
 *                         type: string
 *                         example: "Jakarta, Indonesia"
 *                       status:
 *                         type: string
 *                         example: "success"
 *                       loginMethod:
 *                         type: string
 *                         example: "email"
 *                       loginTime:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-08T08:45:12.000Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-08T08:45:12.000Z"
 *       409:
 *         description: Pengguna belum login (UUID tidak ditemukan)
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
 *                 data:
 *                   type: object
 *                   example: null
 *       429:
 *         description: Terlalu banyak permintaan (dibatasi oleh limiter)
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
 *                   example: Terlalu banyak permintaan, coba lagi nanti
 *                 data:
 *                   type: object
 *                   example: null
 *       503:
 *         description: Server sedang sibuk atau terjadi kesalahan
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

routerauth.get("/count-alluser", authadmin, countUser);
/**
 * @swagger
 * /count-alluser:
 *   get:
 *     summary: Menghitung total pengguna dan menampilkan daftar lengkap pengguna
 *     description: Endpoint ini hanya dapat diakses oleh admin setelah login. Mengembalikan jumlah total pengguna serta data lengkap semua pengguna dari database.
 *     tags:
 *       - auth admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan jumlah dan daftar pengguna
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 jumlah:
 *                   type: integer
 *                   example: 42
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uuid:
 *                         type: string
 *                         example: "c12d3f45-6789-4abc-90de-f123456789ab"
 *                       name:
 *                         type: string
 *                         example: "Erlangga Handika"
 *                       email:
 *                         type: string
 *                         example: "erlangga@example.com"
 *                       phone:
 *                         type: string
 *                         example: "+628123456789"
 *                       hakAkses:
 *                         type: string
 *                         example: "member"
 *                       plan:
 *                         type: string
 *                         example: "premium"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-15T12:30:00.000Z"
 *       409:
 *         description: Pengguna belum login atau token tidak valid
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
 *                   example: Silahkan login terlebih dahulu!
 *       500:
 *         description: Terjadi kesalahan internal di server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

routerauth.patch("/editUserAccess/:uuid",Limiter20, authadmin, editUserAccess );
routerauth.delete("/deleteUser/:uuid",Limiter20, authadmin,deleteUserbyid );
routerauth.get("/getAllTransactions",Limiter20, authadmin, getAllTransactions);
routerauth.get("/income-aplikasi", Limiter20, authadmin, getDatasaldoadmin);
routerauth.get("/income-mentor", Limiter20, authadmin, getdatamentor);
routerauth.get("/seluruh-income", Limiter20, authadmin, totalseluruhsaldo);
routerauth.get("/seluruhpenarikan", Limiter20, authadmin, getAllWithdrawals);
routerauth.patch("/updateWithdrawalStatus", Limiter20, authadmin,upload.fields([
    { name: "image", maxCount: 1 },
  ]), updateWithdrawalStatus);
routerauth.get("/search-user/:search", Limiter20, authadmin, searchUser);
routerauth.get("/verify", verifyOtpViaLink);

export default routerauth;