import { Request, Response, NextFunction } from "express";
import { IJWTService } from "../../interfaces/utils/IJwt";

export interface AuthenticatedRequest extends Request {
  user?: DecodedUser;
}
export interface DecodedUser {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export default class AuthMiddleware {
  constructor(role: string, private jwtService: IJWTService) {
    this.role = role;
  }
  role: string;

  //role-based authentication
  async authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ):Promise<void> {
    try {
      const token = req.cookies.access_token;
      console.log(token, "authenticatedToken"); //i got the token
  
      if (!token) {
         res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
          return
      }
      console.log("sdfghjk");
      const decoded = this.jwtService.verifyAccessToken(token) //Its not working!!!
      console.log(decoded,"qwertyuio")
      if (decoded.role !== this.role) {
         res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
          return
      }
      req.user = decoded as DecodedUser;
      next();
    } catch (error) {
      console.log(error,"errorrr")
       res.status(403).json({ message: "Forbidden: Invalid token" }); //but show this error;
       return;
    }
  }
}
