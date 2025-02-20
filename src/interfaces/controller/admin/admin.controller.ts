import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";

export default interface IAdminAuthController{
    adminLogin(req: Request, res: Response): Promise<void>;
    isAuthenticated(req: Request, res: Response): Promise<void>;
    logOut(req: AuthenticatedRequest, res: Response): Promise<void>
}