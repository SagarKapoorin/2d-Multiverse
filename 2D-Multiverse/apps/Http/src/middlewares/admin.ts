import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
//three things->adding user id to rquest , checking token , checking admin acess
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  let token2: string | undefined;
  if (req.session) {
    token2 = req.session.token;
  }
  console.log(token2)
  const token = header?.split(" ")[1] || token2;
  //['Bearer','Token']
  if (!token) {
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
    if (decoded.role !== "Admin") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
