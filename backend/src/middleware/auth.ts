import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";

declare global {
    namespace Express {
      interface Request {
        userId: string;
      }
    }
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth_token"];
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string)  as JwtPayload;
        req.userId = decoded.userId;

        // Update the lastOnline field for the user
        await User.findByIdAndUpdate(req.userId, { lastOnline: new Date() }, { new: true });
        next();
      } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
      }
};


export { verifyToken };