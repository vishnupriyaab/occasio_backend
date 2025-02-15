import { Request, Response } from "express";

export default interface IUserController {
  registerUser(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  resendOtp(req:Request,res:Response):Promise<void>
  forgotPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  userLogin(req: Request, res: Response): Promise<void>;
  googleLogin(req: Request, res: Response): Promise<void>;
  getUsers(req: Request, res: Response): Promise<void>;
  logOut(req: Request, res: Response): Promise<void>;
  isAuthenticated(req: Request, res: Response): Promise<void>;
  searchUser(req: Request, res: Response): Promise<void>;
}
