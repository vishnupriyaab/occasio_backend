import { Request, Response } from "express";

export default interface IAdminEventController{
    addEvent(req: Request, res: Response): Promise<void>
}