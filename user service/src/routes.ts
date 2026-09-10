import express from "express";
import { registerUser, loginUser, myProfile, saveToPlaylist, clearPlaylist } from "./controller.js";
import { isAuth } from "./middleware.js";
const router = express.Router();



router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.get('/user/me', isAuth, myProfile);
router.post('/user/song/:id', isAuth, saveToPlaylist);
router.delete('/user/playlist', isAuth, clearPlaylist);

export default router;
