import express from "express";
import songRoutes from "./routes.js";
import dotenv from "dotenv";
import redis from "redis";
import cors from 'cors';
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
const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());
app.use("/api/v1", songRoutes);
app.listen(port, () => {
    console.log("Song service is running on port ", port);
});
export default app;
//# sourceMappingURL=index.js.map