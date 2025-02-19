import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../../framework/middlewares/authenticateToken";

export default interface IAdminController{
    adminLogin(req: Request, res: Response): Promise<void>;
    isAuthenticated(req: Request, res: Response): Promise<void>;
    logOut(req: AuthenticatedRequest, res: Response): Promise<void>
}