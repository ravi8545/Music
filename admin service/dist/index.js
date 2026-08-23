import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 7000;
app.use(express.json());
app.listen(PORT, () => {
    console.log(`Admin service is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map