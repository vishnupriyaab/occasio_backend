import { Request, Response, NextFunction } from "express";
import { IJWTService } from "../interfaces/integration/IJwt";
import { HttpStatusCode } from "../constant/httpStatusCodes";

export interface AuthenticatedRequest extends Request{
  id?:string
}

export default class AuthMiddleware {
  constructor(role: string, private _jwtService: IJWTService) {
    this.role = role;
  }
  role: string;

  //role-based authentication
  async authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.cookies.access_token;
      console.log(token, "authenticatedToken");

      if (!token) {
        res.status( HttpStatusCode.UNAUTHORIZED ).json({ message: "Unauthorized: No token provided" });
        return;
      }
        const decoded = this._jwtService.verifyAccessToken(token);
        console.log(decoded, "qwertyuio");
        if (decoded.role !== this.role) {
          res.status( HttpStatusCode.UNAUTHORIZED ).json({ message: "Unauthorized: No token provided" });
          return;
        }
        req.id = decoded.id;
        next();
    } catch (error) {
      console.log(error, "errorrr");
      res.status(HttpStatusCode.FORBIDDEN).json({ message: "Forbidden: Invalid token" });
      return;
    }
  }
}
