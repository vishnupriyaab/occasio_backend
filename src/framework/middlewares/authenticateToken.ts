import { Request, Response, NextFunction } from "express";
import { JWTService } from "../utils/jwtServices";
import { JWTPayload } from "../../interfaces/IJwt";

export interface AuthenticatedRequest extends Request {
  user?: DecodedUser;
}
export interface DecodedUser {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export default class AuthMiddleware{
  constructor(role:string, private jwtService:JWTService){
    this.role = role;
  }
  role:string;

  //role-based authentication
  async authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
      const token = req.cookies?.token;
      console.log(token,"authenticatedToken")
    
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }
    
      try {
        const decoded = this.jwtService.verifyAccessToken(
                token
              ) as JWTPayload;
        if(decoded.role !== this.role){
          return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        req.user = decoded as DecodedUser;
        next();
    
      } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token" })
      }
    };
  
}
