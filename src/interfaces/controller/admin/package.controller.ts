import { Request, Response } from "express";

export default interface IAdminPackageController{
    addPackage(req: Request, res: Response): Promise<void>
    getPackages(req: Request, res: Response): Promise<void>
    updatePackage(req: Request, res: Response): Promise<void>
}