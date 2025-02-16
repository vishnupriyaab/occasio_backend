import { Request, Response } from "express";
import IFoodUseCase from "../interfaces/useCase/food.useCase";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import { handleError, handleSuccess } from "../framework/utils/responseHandler";
import { ResponseMessage } from "../constant/responseMsg";

export class FoodController{
    constructor(private foodUseCase: IFoodUseCase){}
    async addFood(req:Request,res:Response):Promise<void>{
        try {
            const { foodName, category, price, foodSection, status} = req.body
            console.log(foodName,category,price,foodSection,status,"sedrftgyhujikol")

            if(!foodName || !category || !price || !foodSection || !status){
                res.status(HttpStatusCode.BAD_REQUEST).json(handleError(ResponseMessage.FIELDS_REQUIRED,HttpStatusCode.BAD_REQUEST))
                return;
            }
            const food = await this.foodUseCase.addFood({foodName,category,price,foodSection,status})

            res.status(HttpStatusCode.CREATED).json(handleSuccess(ResponseMessage.FOOD_CREATED,HttpStatusCode.CREATED,food))
        } catch (error) {
            
        }
    }
}