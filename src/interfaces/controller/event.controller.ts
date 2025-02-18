import { Request, Response } from "express";

export interface IEventController {
  //events
  addEvent(req: Request, res: Response): Promise<void>;
  updateEvent(req: Request, res: Response): Promise<void>;
  blockEvent(req: Request, res: Response): Promise<void>;
  deleteEvent(req: Request, res: Response): Promise<void>;
  searchEvent(req: Request, res: Response): Promise<void>;
  getEvent(req:Request,res:Response):Promise<void>

  //package
  addPackage(req: Request, res: Response): Promise<void>;
  getPackages(req: Request, res: Response): Promise<void>;
  updatePackage(req: Request, res: Response): Promise<void>;
  deletePackage(req: Request, res: Response): Promise<void>;
  blockPackage(req: Request, res: Response): Promise<void>;

  //features
  getPackageDetails(req: Request, res: Response): Promise<void>;
  addFeature(req:Request,res:Response):Promise<void>
  updateFeature(req:Request,res:Response):Promise<void>
  blockFeature(req: Request, res: Response): Promise<void>;
  deleteFeature(req: Request, res: Response): Promise<void>;
}
