import { Request, Response } from "express"

export interface IEventController{
    addEvent(req: Request, res: Response): Promise<void>
    // getEvents(req: Request, res: Response): Promise<void>
    updateEvent(req: Request, res: Response): Promise<void>
    blockEvent(req: Request, res: Response): Promise<void>
    deleteEvent(req: Request, res: Response): Promise<void>
    searchEvent(req:Request,res:Response):Promise<void>
    addPackage(req: Request, res: Response):Promise<void>
    getPackages(req: Request, res: Response):Promise<void>
    updatePackage(req: Request, res: Response): Promise<void>
    deletePackage(req: Request, res: Response): Promise<void>
    blockPackage(req: Request, res: Response): Promise<void>
}