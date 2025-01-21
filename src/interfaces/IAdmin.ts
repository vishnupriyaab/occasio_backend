import { Request, Response } from "express";
import { AdminLoginResponse, IAdmin } from "../entities/admin.entity";
import { IUser } from "../entities/user.entity";
import { IsAuthenticatedUseCaseRES } from "./IIsAuthenticated";

export interface IAdminController{
    isAuthenticated(req: Request, res: Response): Promise<void>
    adminLogin(req:Request,res:Response):Promise<void>;
    blockUsers(req: Request, res: Response): Promise<void>
    logOut(req: Request, res: Response): Promise<void>
}   

export interface IAdminUseCase {
    adminLogin(email: string, password: string):Promise<{ accessToken: string; refreshToken: string }>
    findAdminByEmail(email: string): Promise<IAdmin | null>
    blockUser(userId:string):Promise<IUser | null>
    isAuthenticated(
        token: string | undefined
      ): Promise<IsAuthenticatedUseCaseRES>
}

export interface IAdminRepository {
    findAdminByEmail(email:string):Promise<IAdmin | null>
    validateCredentials(email: string, password: string): Promise<boolean>
    findById(id:string):Promise<IUser | null>
    updateStatus(id:string, updateData:any):Promise<IUser | null>
}

