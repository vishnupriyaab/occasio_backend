import { Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";

export default interface IEmplProfileController{
    showProfile(req: AuthenticatedRequest, res: Response): Promise<void>
    updateProfile(req: AuthenticatedRequest, res: Response): Promise<void>
    updateProfileImage(
        req: AuthenticatedRequest,
        res: Response
      ): Promise<void>
}