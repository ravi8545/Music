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
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api_Key,
    api_secret: process.env.Cloud_Api_Secret,
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
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
        await sql `
        CREATE TABLE IF NOT EXISTS songs(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255),
          audio VARCHAR(255) NOT NULL,
          album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
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