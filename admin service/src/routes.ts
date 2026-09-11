import express from 'express';
import uploadFile, { uploadMultipleFiles, isAuth } from "./middleware.js";
import { addAlbum, addSong, addBulkSongs, addThumbnail, deleteAlbum, deleteSong } from "./controller.js";

const router = express.Router();

router.post("/album/new", isAuth, uploadFile, addAlbum);
router.post("/song/new", isAuth, uploadFile, addSong);
router.post("/songs/bulk", isAuth, uploadMultipleFiles, addBulkSongs);
router.post("/song/:id", isAuth, uploadFile, addThumbnail);
router.delete("/album/:id", isAuth, deleteAlbum);
router.delete("/song/:id", isAuth, deleteSong);

export default router;
