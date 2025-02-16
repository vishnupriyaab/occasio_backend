import { IFood } from "../entities/food.entity";
import IFoodRepository from "../interfaces/repository/food.Repository";

export class FoodUseCase{
    constructor(private foodRepo: IFoodRepository){}

    async addFood(foodData: IFood):Promise<any>{
        try {
            const foodName = foodData.foodName.toLowerCase();
            // const existingFood = await this.foodRepo.findByFoodName(foodName);
        } catch (error) {
            throw error;
        }
    }
}