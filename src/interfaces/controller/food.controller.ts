import { Request, Response } from "express";

export interface IFoodController{
    addFood(req:Request,res:Response):Promise<void>
    SearchFood(req:Request,res:Response):Promise<void>
    editFood(req:Request,res:Response):Promise<void>
}