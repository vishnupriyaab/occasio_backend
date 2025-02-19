import { Request, Response } from "express";

export default interface IAdminController {
  
 
  blockUsers(req: Request, res: Response): Promise<void>;
  blockEmployee(req:Request,res:Response):Promise<void>
  searchEmployee(req:Request,res:Response):Promise<void>
  searchUser(req: Request, res: Response): Promise<void>;
}
