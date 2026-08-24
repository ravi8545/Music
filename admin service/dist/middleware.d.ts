import type { Request, Response, NextFunction } from 'express';
interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    playlist: string[];
}
interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}
export declare const isAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const upload: any;
export {};
//# sourceMappingURL=middleware.d.ts.map