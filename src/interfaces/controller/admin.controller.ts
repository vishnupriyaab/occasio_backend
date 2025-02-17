import { Request, Response } from "express";

export default interface IAdminController {
  isAuthenticated(req: Request, res: Response): Promise<void>;
  adminLogin(req: Request, res: Response): Promise<void>;
  blockUsers(req: Request, res: Response): Promise<void>;
  blockEmployee(req:Request,res:Response):Promise<void>
  searchEmployee(req:Request,res:Response):Promise<void>
  logOut(req: Request, res: Response): Promise<void>;
  searchUser(req: Request, res: Response): Promise<void>;
}
