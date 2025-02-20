import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";

export default interface IUserController{
    blockUsers(req: AuthenticatedRequest, res: Response): Promise<void>
    searchUser(req: Request, res: Response): Promise<void>
} 