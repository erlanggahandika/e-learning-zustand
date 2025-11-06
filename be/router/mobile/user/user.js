import express from "express";
import { Limiter20, Limiter1days } from "../../../middleware/Limiter.js";
import { authMiddleware } from "../../../middleware/Verify.js";
import { getMyProfile, getMypost, searchuser,getUserProfile, followUser,  getCommunitybyparams,  getAllMyCommunities, getOrCreatePrivateChat, sendMessage, getMessages, getUserChatRooms } from "../../../controller/mobile/user/user.js";
const router = express.Router();

router.get("/my-profile",  authMiddleware, getMyProfile);
router.get("/user-profile/:uuid",  authMiddleware, getUserProfile);
router.get("/my-post",  authMiddleware, getMypost);
router.get("/search-user/:keyword",  authMiddleware, searchuser);
router.post("/follow-user/:uuid",  authMiddleware, followUser);
router.get("/my-community",  authMiddleware,  getAllMyCommunities);
router.get("/get-usercommunity-by-params/:uuid",  authMiddleware, getCommunitybyparams);

//chat

router.post("/start-chat",  authMiddleware,  getOrCreatePrivateChat);
router.get("/get-messages/:chatRoomId",  authMiddleware,  getMessages);
router.post("/send-message",  authMiddleware,  sendMessage);
router.get("/get-rooms",  authMiddleware,  getUserChatRooms);
export default router;