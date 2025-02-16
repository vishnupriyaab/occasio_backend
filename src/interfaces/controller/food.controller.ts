import { Request, Response } from "express";

export interface IFoodController{
    addFood(req:Request,res:Response):Promise<void>
}