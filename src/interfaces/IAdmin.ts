import { Request, Response } from "express";
import { IAdmin } from "../entities/admin.entity";

export interface IAdminController{
    adminLogin(req:Request,res:Response):Promise<Response | void>;
}


// interfaces/IAdminUseCase.ts
export interface IAdminUseCase {
    adminLogin(email: string, password: string): Promise<AdminLoginResponse>;
}

// interfaces/IAdminRepository.ts
export interface IAdminRepository {
    // getAdminEmail(): string;
    // getAdminPassword(): string;
    // getJwtSecret(): string;
    findAdminByEmail(email:string):Promise<IAdmin | null>
}



// types/admin.types.ts
export type AdminLoginResponse = {
    success: boolean;
    // token?: string;
    accessToken?:string;
    refreshToken?:string;
    error?: string;
}