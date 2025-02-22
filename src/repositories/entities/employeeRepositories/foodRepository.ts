import { FilterQuery } from "mongoose";
import { IAddFood, IFood } from "../../../interfaces/entities/food.entity";
import IEmplFoodRepository from "../../../interfaces/repository/employee/food.repository";
import Food from "../../../models/foodModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class EmplFoodRepository
  extends CommonBaseRepository<{ food: IFood & Document }>
  implements IEmplFoodRepository
{
  constructor() {
    super({ food: Food });
  }

  async findByFoodName(foodName: string): Promise<IFood | null> {
    return this.findOne("food", { foodName });
  }

  async addFood(food: IAddFood): Promise<IFood> {
    return this.createData("food", food);
  }

  async updateFood(
    foodId: string,
    foodData: Partial<IFood>
  ): Promise<IFood | null> {
    return this.updateById("food", foodId, foodData);
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
        const query: FilterQuery<IFood> = {};

        // Build query filters
        if (searchTerm && searchTerm.trim() !== "") {
            query.foodName = {
                $regex: searchTerm.trim(),
                $options: "i",
            };
        }

        if (status && status !== "all") {
            query.status = status === "blocked" ? "Not Available" : "Available";
        }

        if (category && category !== "all") {
            query.category = category === "vegetarian" ? "Vegetarian" : "Non-vegetarian";
        }

        if (session && session !== "all") {
            const sessionMap: { [key: string]: string } = {
                "welcome-drink": "Welcome Drink",
                "main-food": "Main Food",
                "dessert": "Dessert"
            };
            query.foodSection = sessionMap[session];
        }

        // Set up sort options
        const sortOptions: Record<string, 1 | -1> = {};
        if (price && price !== "all") {
            switch (price) {
                case "low":
                    sortOptions.price = 1;
                    break;
                case "high":
                    sortOptions.price = -1;
                    break;
                default:
                    sortOptions.createdAt = -1;
            }
        } else {
            sortOptions.createdAt = -1;
        }

        // Use existing findMany method with pagination and sorting
        const foods = await this.findMany('food', query, {
            skip: (page - 1) * limit,
            limit: limit,
            sort: sortOptions
        });

        // Use existing count method
        const totalFoods = await this.count('food', query);
        const totalPages = Math.ceil(totalFoods / limit);

        return {
            foods,
            totalFoods,
            totalPages,
            currentPage: page,
        };

    } catch (error) {
        throw error;
    }
}

}
