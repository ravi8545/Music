import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./routes.js";
import cloudinary from 'cloudinary';
import redis from "redis";
import cors from "cors";
dotenv.config();
export const redisClient = redis.createClient({
    password: process.env.Redis_Password || "",
    socket: {
        host: "granular-line-pigs-42428.db.redis.io",
        port: 18511
    }
});
redisClient.on("error", (error) => {
    console.error("Redis Client Error:", error.message);
});
redisClient.connect().then(() => {
    console.log("Redis connected successfully");
}).catch((error) => {
    console.log(error);
});
cloudinary.v2.config({
    cloud_name: (process.env.Cloud_Name || "").trim(),
    api_key: (process.env.Cloud_Api_Key || "").trim(),
    api_secret: (process.env.Cloud_Api_Secret || "").trim(),
});
const app = express();
app.use(express.json());
app.use(cors());
async function initDB() {
    try {
        await sql `
        CREATE TABLE IF NOT EXISTS albums(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          thumbnail TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
        await sql `
        CREATE TABLE IF NOT EXISTS songs(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          thumbnail TEXT,
          audio TEXT NOT NULL,
          album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
        // Alter existing columns from VARCHAR(255) to TEXT if table already exists
        try {
            await sql `ALTER TABLE albums ALTER COLUMN description TYPE TEXT`;
            await sql `ALTER TABLE albums ALTER COLUMN thumbnail TYPE TEXT`;
            await sql `ALTER TABLE songs ALTER COLUMN description TYPE TEXT`;
            await sql `ALTER TABLE songs ALTER COLUMN thumbnail TYPE TEXT`;
            await sql `ALTER TABLE songs ALTER COLUMN audio TYPE TEXT`;
        }
        catch (alterErr) {
            // Columns may already be TEXT, ignore errors
        }
        console.log("Database initialized successfully");
    }
    catch (error) {
        console.log("Error initDb", error);
    }
}
app.use("/api/v1", adminRoutes);
const port = process.env.PORT;
initDB().then(() => {
    app.listen(port, () => {
        console.log(`Admin service is running on port ${port}`);
    });
});
//# sourceMappingURL=index.js.map