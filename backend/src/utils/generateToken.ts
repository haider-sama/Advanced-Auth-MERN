import jwt from 'jsonwebtoken';
import { Response } from "express";

const generateToken = (res: Response, userId: any) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: '1d',
  });

  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 86400000, // 1 day
  });
};

export default generateToken;