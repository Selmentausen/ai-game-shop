import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
    userId: number;
    email: string;
}

export interface AuthRequest extends Request {
    user?: TokenPayload;
}

export const JWT_SECRET = process.env.JWT_SECRET || "my_super-secret_key_123";

export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: "Authentication token required" });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: "Invalid or expired token" });
            return;
        }
        req.user = decoded as TokenPayload
        next()
    });
};