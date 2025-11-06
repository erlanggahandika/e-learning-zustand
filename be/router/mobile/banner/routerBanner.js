import express from "express";
import { Limiter, Limiter2, Limiter20 , Limiter30, Limiter50, Limiter5, Limiter15, Limiter10, Limiter8} from "../../../middleware/Limiter.js";
import { authMiddleware } from "../../../middleware/Verify.js";
import { getBanner} from "../../../controller/mobile/banner/banner.js";
const router = express.Router();

router.get("/get-banner",Limiter20, authMiddleware, getBanner);

export default router;