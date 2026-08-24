import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();
export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(403).json({
                message: "Please Login",
            });
        }
        const { data } = await axios.get(`${process.env.User_URL}/api/v1/user/me`);
        headers: {
            token;
        }
        req.user = data;
        next();
    }
    catch (err) {
        res.status(403).json({
            message: "Please Login"
        });
    }
};
import multer from "multer";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
export const upload = multer({ storage });
//# sourceMappingURL=middleware.js.map