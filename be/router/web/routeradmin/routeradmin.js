import express from "express";
import { Limiter, Limiter2, Limiter20 , Limiter30, Limiter50, Limiter5, Limiter15, Limiter10, Limiter8} from "../../../middleware/Limiter.js";
import { authMiddleware, authadmin } from "../../../middleware/Verify.js";
import { searchTransactions, 
    getAllTransactionsbydate, 
    getAllSubscriptions, 
    getAllTransactions,
    searchSubscriptions,
    getSubscriptionsbydate
 } from "../../../controller/web/transaction/alltransaction.js"
import {
    getBanneradmin,
    createBanneradmin,
    updateBanneradmin,
    getBannerByUuid,
    deleteBanneradmin
} from "../../../controller/web/banner/kelolabanner.js"

import {
  getNotifikasi,
  updateStatusNotifikasi,
  getNotifikasibyId
} from "../../../controller/web/notification/notifikasi.js"

import { upload } from "../../../middleware/Upload.js";
const router = express.Router();

router.post("/search-transactions/:search", Limiter20, authadmin, searchTransactions);
router.get("/transactions-by-date", Limiter20, authadmin, getAllTransactionsbydate);
router.get("/getAllSubscriptions", Limiter20, authadmin, getAllSubscriptions);
router.get("/getAllTransactions", Limiter20, authadmin, getAllTransactions);
router.post("/search-subscriptions/:search", Limiter20, authadmin, searchSubscriptions);
router.get("/subscriptions-by-date", Limiter20, authadmin, getSubscriptionsbydate);


//banner ===== // bannerrr
router.get("/get-banner-admin", Limiter20, authadmin, getBanneradmin);
router.post("/create-banner-admin", Limiter20, authadmin, upload.fields([
    { name: "image", maxCount: 1 },
  ]), createBanneradmin);
router.patch("/update-banner-admin/:uuid", Limiter20, authadmin, upload.fields([
    { name: "image", maxCount: 1 },
  ]), updateBanneradmin);
router.get("/get-banner-admin-by-id/:uuid", Limiter20, authadmin, getBannerByUuid);
router.delete("/delete-banner-admin/:uuid", Limiter20, authadmin, deleteBanneradmin);


//notifikasi
router.get("/get-notifikasi-admin", Limiter20, authadmin, getNotifikasi);
router.get("/getbyuuid-status-notification/:id", Limiter15, authadmin, getNotifikasibyId); //update status notifikasi
export default router; 