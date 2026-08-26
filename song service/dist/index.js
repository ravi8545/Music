import express from "express";
import songRoutes from "./routes.js";
const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use("/api/v1", songRoutes);
app.listen(port, () => {
    console.log("Song service is running on port ", port);
});
export default app;
//# sourceMappingURL=index.js.map