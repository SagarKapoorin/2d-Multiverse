import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  let token2: string | undefined;
  if (req.session) {
    console.log("token2");
    console.log(token2);
    token2 = req.session.token;
  }
  const token = header?.split(" ")[1] || token2;
  if (!token) {
    console.log("forbid");
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, secret) as {
      role: string;
      userId: string;
    };
    
    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
