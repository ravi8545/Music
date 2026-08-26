import express from 'express';
import { getAllAlbum, getAllSongsOfAlbum, getAllsongs, getSingleSong } from './controller.js';
const Router = express.Router();
Router.get('/album/all', getAllAlbum);
Router.get('/songs/all', getAllsongs);
Router.get('/album/:id', getAllSongsOfAlbum);
Router.get('/song/:id', getSingleSong);
export default Router;
//# sourceMappingURL=routes.js.map