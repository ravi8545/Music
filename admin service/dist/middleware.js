import axios from 'axios';
import dotenv from "dotenv";
import multer from "multer";
dotenv.config();
export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(401).json({
                message: "Please login to perform this action",
            });
            return;
        }
        const { data } = await axios.get(`${process.env.User_URL}/api/v1/user/me`, {
            headers: {
                token,
            },
        });
        if (!data || !data._id) {
            res.status(401).json({
                message: "Invalid token. Please login.",
            });
            return;
        }
        req.user = data;
        next();
    }
    catch (err) {
        res.status(401).json({
            message: "Authentication failed. Please login to perform this action.",
        });
    }
};
const storage = multer.memoryStorage();
export const uploadFile = multer({ storage }).single("file");
export const uploadMultipleFiles = multer({ storage }).array("files", 25);
export default uploadFile;
//# sourceMappingURL=middleware.js.map