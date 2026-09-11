import TryCatch from "./TryCatch.js";
import { sql } from "./config/db.js";
import { redisClient } from "./index.js";

export const getAllAlbum = TryCatch(async (req, res) => {
    let albums;
    const CACHE_EXPIRY = 60 * 60 * 24;

    if (redisClient.isReady) {
        albums = await redisClient.get("albums");
    }

    if (albums) {
        console.log("Cache hit");
        res.json(JSON.parse(albums));
        return;
    } else {
        console.log("cache miss");
        albums = await sql`SELECT * FROM albums`;

        if (redisClient.isReady) {
            await redisClient.set("albums", JSON.stringify(albums), {
                EX: CACHE_EXPIRY
            })
        }
        return res.json(albums);

    }

})

export const getAllsongs = TryCatch(async (req, res) => {
    let songs;

    const CACHE_EXPIRY = 60 * 60 * 24;

    // Check Redis cache
    if (redisClient.isReady) {
        songs = await redisClient.get("songs");
    }

    // Cache hit
    if (songs) {
        console.log("Cache hit");
        return res.json(JSON.parse(songs));
    }

    // Cache miss
    console.log("Cache miss");

    // Get songs from database
    songs = await sql`SELECT * FROM songs`;

    // Store songs in Redis
    if (redisClient.isReady) {
        await redisClient.set(
            "songs",
            JSON.stringify(songs),
            {
                EX: CACHE_EXPIRY
            }
        );
    }

    return res.json(songs);
});

export const getAllSongsOfAlbum = TryCatch(async (req, res) => {
    const { id } = req.params;
    let album, songs;
    const CACHE_EXPIRY = 60 * 60 * 24;

    if (redisClient.isReady) {
        const cacheData = await redisClient.get(`album_songs_${id}`);
        if (cacheData) {
            console.log("cache hit");
            return res.json(JSON.parse(cacheData));
        }
    }

    album = await sql`SELECT * FROM albums WHERE id = ${id}`;

    if (album.length === 0) {
        res.status(404).json({
            message: "No album with this id"
        });
        return;
    }

    songs = await sql`SELECT * FROM songs WHERE album_id = ${id}`;

    const response = { songs, album: album[0] };

    if(redisClient.isReady){
        await redisClient.set(`album_songs_${id}`, JSON.stringify(response),{
            EX: CACHE_EXPIRY
        });
    }

    console.log("cache miss");
    res.json(response);

})

export const getSingleSong = TryCatch(async (req, res) => {
    const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;

    res.json(song[0]);
})