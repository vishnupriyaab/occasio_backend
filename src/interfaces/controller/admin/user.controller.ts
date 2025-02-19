import { Response } from "express";
import { AuthenticatedRequest } from "../../../framework/middlewares/authenticateToken";

export default interface IUserController{
    blockUsers(req: AuthenticatedRequest, res: Response): Promise<void>
} 