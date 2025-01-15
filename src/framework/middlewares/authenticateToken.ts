import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: DecodedUser;
}
export interface DecodedUser {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  console.log(token,"authenticatedToken")

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "occasio");

    req.user = decoded as DecodedUser;
    next();

  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" })
  }
};
