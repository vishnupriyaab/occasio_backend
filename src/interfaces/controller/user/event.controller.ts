import { Request, Response } from "express";

export default interface IUserEventController{
    getEvent(req: Request, res: Response): Promise<void> 
}