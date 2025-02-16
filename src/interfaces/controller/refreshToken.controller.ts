import { Request, Response } from "express";

export interface IRefreshTokenController{
    getNewAccessTokenWithRefreshToken(req:Request,res:Response):Promise<void>
}