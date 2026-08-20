import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { User, type IUser } from "./model.js";



export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.token as string;

        if (!token) {
            res.status(401).json({
                message: "Please login"
            });
            return;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        if (!decoded || !decoded.id) {
            res.status(403).json({
                message: "Invalid token"
            });
            return;
        }

        const user = await User
            .findById(decoded.id)
            .select("-password");

        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(403).json({
            message: "Please login"
        });
    }
};