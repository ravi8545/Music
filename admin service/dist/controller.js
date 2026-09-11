import TryCatch from "./TryCatch.js";
import { uploadToCloudinary } from "./config/dataUri.js";
import { sql } from "./config/db.js";
import { redisClient } from "./index.js";
export const addAlbum = TryCatch(async (req, res) => {
    if (!req.user) {
        res.status(401).json({
            message: "Please login to perform this action",
        });
        return;
    }
    const { title, description } = req.body;
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "No album cover file to upload",
        });
        return;
    }
    const cloud = await uploadToCloudinary(file, {
        folder: "albums",
    });
    const result = await sql `
   INSERT INTO albums (title, description, thumbnail) VALUES (${title}, ${description}, ${cloud.secure_url}) RETURNING *
  `;
    if (redisClient.isReady) {
        await redisClient.del("albums");
        console.log("cache invalidated for albums");
    }
    res.json({
        message: "Album Created",
        album: result[0],
    });
});
export const addSong = TryCatch(async (req, res) => {
    if (!req.user) {
        res.status(401).json({
            message: "Please login to perform this action",
        });
        return;
    }
    const { title, description, album } = req.body;
    const isAlbum = await sql `SELECT * FROM albums WHERE id = ${album}`;
    if (isAlbum.length === 0) {
        res.status(404).json({
            message: "No album with this id",
        });
        return;
    }
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "No audio file to upload",
        });
        return;
    }
    // Upload audio stream to Cloudinary
    const cloud = await uploadToCloudinary(file, {
        folder: "songs",
        resource_type: "auto",
    });
    const result = await sql `
  INSERT INTO songs (title, description, audio, album_id) VALUES
  (${title}, ${description || "Album Track"}, ${cloud.secure_url}, ${album})
  RETURNING *
  `;
    if (redisClient.isReady) {
        await redisClient.del("songs");
        await redisClient.del(`album_songs_${album}`);
        console.log(`cache invalidated for songs and album_songs_${album}`);
    }
    res.json({
        message: "Song added",
        song: result[0],
    });
});
export const addBulkSongs = TryCatch(async (req, res) => {
    if (!req.user) {
        res.status(401).json({
            message: "Please login to perform this action",
        });
        return;
    }
    const { album, description } = req.body;
    const isAlbum = await sql `SELECT * FROM albums WHERE id = ${album}`;
    if (isAlbum.length === 0) {
        res.status(404).json({
            message: "No album with this id",
        });
        return;
    }
    const files = req.files;
    if (!files || files.length === 0) {
        res.status(400).json({
            message: "No audio files uploaded",
        });
        return;
    }
    let titles = [];
    if (req.body.titles) {
        try {
            titles = typeof req.body.titles === "string" ? JSON.parse(req.body.titles) : req.body.titles;
        }
        catch {
            titles = [req.body.titles];
        }
    }
    const desc = description || "Album Track";
    const insertedSongs = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file)
            continue;
        const defaultTitle = file.originalname ? file.originalname.replace(/\.[^/.]+$/, "") : `Track ${i + 1}`;
        const rawTitle = titles[i];
        const trackTitle = (rawTitle && typeof rawTitle === "string" && rawTitle.trim()) ? rawTitle.trim() : defaultTitle;
        const cloud = await uploadToCloudinary(file, {
            folder: "songs",
            resource_type: "auto",
        });
        const result = await sql `
      INSERT INTO songs (title, description, audio, album_id) VALUES
      (${trackTitle}, ${desc}, ${cloud.secure_url}, ${album})
      RETURNING *
    `;
        insertedSongs.push(result[0]);
    }
    if (redisClient.isReady) {
        await redisClient.del("songs");
        await redisClient.del(`album_songs_${album}`);
        console.log(`cache invalidated for songs and album_songs_${album}`);
    }
    res.json({
        message: `Successfully added ${insertedSongs.length} song(s)`,
        songs: insertedSongs,
    });
});
export const addThumbnail = TryCatch(async (req, res) => {
    if (!req.user) {
        res.status(401).json({
            message: "Please login to perform this action",
        });
        return;
    }
    const song = await sql `SELECT * FROM songs WHERE id = ${req.params.id}`;
    if (song.length === 0) {
        res.status(404).json({
            message: "No song with this id",
        });
        return;
    }
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "No file to upload",
        });
        return;
    }
    const cloud = await uploadToCloudinary(file, {
        folder: "thumbnails",
    });
    const result = await sql `
  UPDATE songs SET thumbnail = ${cloud.secure_url} WHERE id = ${req.params.id} RETURNING *
  `;
    if (redisClient.isReady) {
        await redisClient.del("songs");
        const albumId = song[0]?.album_id;
        if (albumId) {
            await redisClient.del(`album_songs_${albumId}`);
        }
        console.log("cache invalidated for songs");
    }
    res.json({
        message: "Thumbnail added",
        song: result[0],
    });
});
export const deleteAlbum = TryCatch(async (req, res) => {
    if (!req.user) {
        res.status(401).json({
            message: "Please login to perform this action",
        });
        return;
    }
    const { id } = req.params;
    const isAlbum = await sql `SELECT * FROM albums WHERE id = ${id}`;
    if (isAlbum.length === 0) {
        res.status(404).json({
            message: "No album with this id",
        });
        return;
    }
    await sql `DELETE FROM songs WHERE album_id = ${id}`;
    await sql `DELETE FROM albums WHERE id = ${id}`;
    if (redisClient.isReady) {
        await redisClient.del("albums");
        await redisClient.del("songs");
        await redisClient.del(`album_songs_${id}`);
        console.log("cache invalidated for albums, songs, and album_songs");
    }
    res.json({
        message: "Album deleted",
    });
});
export const deleteSong = TryCatch(async (req, res) => {
    if (!req.user) {
        res.status(401).json({
            message: "Please login to perform this action",
        });
        return;
    }
    const { id } = req.params;
    const song = await sql `SELECT * FROM songs WHERE id = ${id}`;
    if (song.length === 0) {
        res.status(404).json({
            message: "No song with this id",
        });
        return;
    }
    const albumId = song[0]?.album_id;
    await sql `DELETE FROM songs WHERE id = ${id}`;
    if (redisClient.isReady) {
        await redisClient.del("albums");
        await redisClient.del("songs");
        if (albumId) {
            await redisClient.del(`album_songs_${albumId}`);
        }
        console.log("cache invalidated for albums, songs, and album_songs");
    }
    res.json({
        message: "Song deleted",
    });
});
//# sourceMappingURL=controller.js.map