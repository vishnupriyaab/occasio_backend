import { Request, Response } from "express";

export default interface IEmplAuthController{
    registerEmployee(req: Request, res: Response): Promise<void>
    verifyOtp(req: Request, res: Response): Promise<void>   
    employeeLogin(req: Request, res: Response): Promise<void>
    forgotPassword(req: Request, res: Response): Promise<void>
    resetPassword(req: Request, res: Response): Promise<void>
    logOut(req: Request, res: Response): Promise<void>
    isAuthenticated(req: Request, res: Response): Promise<void>
}