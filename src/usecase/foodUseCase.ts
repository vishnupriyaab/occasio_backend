import { IAddFood, IFood } from "../entities/food.entity";
import IFoodRepository from "../interfaces/repository/food.Repository";
import IFoodUseCase from "../interfaces/useCase/food.useCase";

export class FoodUseCase  implements IFoodUseCase{
  constructor(private foodRepo: IFoodRepository) {}

  async addFood(foodData: IFood): Promise<any> {
    try {
      const foodName = foodData.foodName.toLowerCase();
      const existingFood = await this.foodRepo.findByFoodName(foodName);
      console.log(existingFood, "swertyuiovb");
      if (existingFood) {
        throw new Error(`Food with name "${foodName}" already exist`);
      }
      const food: IAddFood = { ...foodData };
      console.log(food, "1234567890");
      const newFood = await this.foodRepo.addFood(food);
      return newFood;
    } catch (error) {
      throw error;
    }
  }

  async updateFood(foodId:string, foodData: IAddFood):Promise<IFood | undefined | null>{
    try {
        return this.foodRepo.updateFood(foodId,foodData);
    } catch (error) {
        throw error;
    }
  }

  async searchFood(
    searchTerm: string,
    status:string,
    price:string,
    category:string,
    session:string,
    page: number,
    limit: number
  )
  : Promise<{
    foods: IFood[];
    totalFoods: number;
    totalPages: number;
    currentPage: number;
  }> 
  {
    try {
        if (page < 1) throw new Error("Page number must be positive");
      if (limit < 1) throw new Error("Limit must be positive");

      return await this.foodRepo.searchFood(
        searchTerm,
        status,
        price,
        category,
        session,
        page,
        limit
      );
    } catch (error) {
        throw new Error(
            `Use case search failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
    }
  }
}
