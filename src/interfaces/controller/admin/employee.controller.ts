import { Request, Response } from "express";

export default interface IAdminEmployeeController{
    blockEmployee(req: Request, res: Response): Promise<void>
    searchEmployee(req: Request, res: Response): Promise<void>
}