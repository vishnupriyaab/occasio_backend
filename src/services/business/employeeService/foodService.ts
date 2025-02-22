import { IAddFood, IFood } from "../../../interfaces/entities/food.entity";
import IEmplFoodRepository from "../../../interfaces/repository/employee/food.repository";
import IEmplFoodService from "../../../interfaces/services/employee/food.services";
import { EmplFoodRepository } from "../../../repositories/entities/employeeRepositories/foodRepository";

export class EmplFoodService implements IEmplFoodService {
  private _foodRepo: IEmplFoodRepository;
  constructor(foodRepo: IEmplFoodRepository) {
    this._foodRepo = foodRepo;
  }

  async addFood(foodData: IFood): Promise<any> {
    try {
      const foodName = foodData.foodName.toLowerCase();
      const existingFood = await this._foodRepo.findByFoodName(foodName);
      console.log(existingFood, "swertyuiovb");
      if (existingFood) {
        throw new Error(`Food with name "${foodName}" already exist`);
      }
      const food: IAddFood = { ...foodData };
      console.log(food, "1234567890");
      const newFood = await this._foodRepo.addFood(food);
      return newFood;
    } catch (error) {
      throw error;
    }
  }

  async updateFood(
    foodId: string,
    foodData: IAddFood
  ): Promise<IFood | undefined | null> {
    try {
      return this._foodRepo.updateFood(foodId, foodData);
    } catch (error) {
      throw error;
    }
  }

  async searchFood(
    searchTerm: string,
    status: string,
    price: string,
    category: string,
    session: string,
    page: number,
    limit: number
  ): Promise<{
    foods: IFood[];
    totalFoods: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      if (page < 1 || limit < 1) {
        const error = new Error("Invalid Page Or Limit");
        error.name = "InvalidPageOrLimit";
        throw error;
      }

      return await this._foodRepo.searchFood(
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

const emplFoodRepository = new EmplFoodRepository();
export const emplFoodServices = new EmplFoodService(emplFoodRepository);
