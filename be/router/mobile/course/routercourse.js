import express from "express";
import { authadmin, authMiddleware } from "../../../middleware/Verify.js";
import {createCourse,
    getCourse,
     getCourseById,
     updateCourse,
     deleteCourse,
     getmysaldo,
     getmyKelas,
     listUseryangbeli,
     getkelasuser, 
     searchkelasuser,
     getCourses
 } from "../../../controller/mobile/course/course.js";
import {
    tambahPertemuan,
    listPertemuan,
    updatePertemuan,
    hapusPertemuan
} from "../../../controller/mobile/course/pertemuan.js";
import {
    buatSoalpertemuan,
    listTestMeeting, 
     hapusSoalPertemuan,
    submitTestResult,
    listTestResult
} from "../../../controller/mobile/course/soal.js";
import { 
    belicourse,
    midtransWebhook
} from "../../../controller/mobile/course/payment.js";
import {
    createWithdrawal,
    getMyWithdrawals
} from "../../../controller/mobile/course/penarikan.js";
import { upload } from "../../../middleware/Upload.js";
import { Limiter20, Limiter1days } from "../../../middleware/Limiter.js";

const router = express.Router();


//course
router.post("/create-course",Limiter20, authMiddleware, upload.fields([
    { name: "image", maxCount: 1 },
  ]),  createCourse);
router.get("/get-course",Limiter20, authMiddleware, getCourse);
router.get("/get-courses",Limiter20, getCourses);
router.get("/get-course-by-id/:uuid",Limiter20, authMiddleware, getCourseById);
router.patch("/update-course/:uuid",Limiter20, authMiddleware, updateCourse);
router.delete("/delete-course/:uuid",Limiter20, authMiddleware, deleteCourse);

//pertemuan course
router.post("/tambah-pertemuan/:uuid",Limiter20, authMiddleware, tambahPertemuan);
router.get("/list-pertemuan/:uuid",Limiter20, authMiddleware, listPertemuan);
router.patch("/update-pertemuan/:uuid",Limiter20, authMiddleware, updatePertemuan);
router.delete("/hapus-pertemuan/:uuid",Limiter20, authMiddleware, hapusPertemuan);

//soal pertemuan
router.post("/buat-soal-pertemuan/:uuid",Limiter20, authMiddleware, buatSoalpertemuan);
router.get("/list-soal-pertemuan/:uuid",Limiter20, authMiddleware, listTestMeeting);
router.delete("/delete-soal-pertemuan/:uuid",Limiter20, authMiddleware,  hapusSoalPertemuan);
router.post("/submit-soal-pertemuan/:uuid",Limiter20, authMiddleware, submitTestResult);
router.get("/list-soal-pertemuan-result/:uuid",Limiter20, authMiddleware, listTestResult);


//beli course
router.post("/beli-course/:uuid",Limiter20, authMiddleware, belicourse);
router.post("/midtrans-webhookk", midtransWebhook);

//saldo mentor
router.get("/get-mysaldo",Limiter20, authMiddleware, getmysaldo);
router.get("/get-my-kelas",Limiter20, authMiddleware, getmyKelas);
router.post("/create-penarikan",Limiter20, authMiddleware, createWithdrawal);
router.get("/get-my-penarikan",Limiter20, authMiddleware, getMyWithdrawals);

//list user yang beli
router.get("/list-useryangbeli",Limiter20, authMiddleware, listUseryangbeli);

//get kelas user itu sendiri
router.get("/get-kelasuser",Limiter20, authMiddleware, getkelasuser);
router.get("/search-kelasuser/:search",Limiter20, authMiddleware, searchkelasuser);
export default router;
