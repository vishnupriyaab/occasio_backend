import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../framework/middlewares/authenticateToken";

export default interface IEmployeeController {
  registerEmployee(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  employeeLogin(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  logOut(req: Request, res: Response): Promise<void>;
  isAuthenticated(req: Request, res: Response): Promise<void>;
  showProfile(req: AuthenticatedRequest, res: Response): Promise<void>
  updateProfile(req: AuthenticatedRequest, res: Response): Promise<void>
  updateProfileImage( req: AuthenticatedRequest, res: Response ): Promise<void>
}
