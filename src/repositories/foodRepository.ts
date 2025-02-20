import mongoose from "mongoose";
import { IAddFood, IFood } from "../entities/food.entity";
import Food from "../models/foodModel";
import IFoodRepository from "../interfaces/repository/food.Repository";

export class FoodRepository implements IFoodRepository{
  async findByFoodName(eventName: string): Promise<IFood | null> {
    try {
      return Food.findOne({ eventName });
    } catch (error) {
      throw error;
    }
  }
  async addFood(food: IAddFood): Promise<IFood | void> {
    try {
      console.log(food, "food in repo");
      const newFood = new Food(food);
      return newFood.save();
    } catch (error) {
      throw error;
    }
  }
  async updateFood(id: string, updatedData: IAddFood): Promise<IFood | null> {
    try {
      return Food.findByIdAndUpdate(id, updatedData, { new: true });
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
  ): Promise<{
    foods: IFood[];
    totalFoods: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
        const query: mongoose.FilterQuery<IFood> = {};
        if(searchTerm && searchTerm.trim() !== ""){
            query.foodName = {
                $regex: searchTerm.trim(),
                $options: "i",
            }
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

        const skip = (page - 1) * limit;

        let foodQuery = Food.find(query);

        if (price && price !== "all") {
            switch (price) {
                case "low":
                    foodQuery = foodQuery.sort({ price: 1 }); // Low to High
                    break;
                case "high":
                    foodQuery = foodQuery.sort({ price: -1 }); // High to Low
                    break;
                default:
                    foodQuery = foodQuery.sort({ createdAt: -1 });
            }
        } else {
            foodQuery = foodQuery.sort({ createdAt: -1 }); // Default sorting
        }

        const foods = await foodQuery.skip(skip).limit(limit);

        const totalFoods = await Food.countDocuments(query);
        const totalPages = Math.ceil(totalFoods / limit);

        return {
            foods: foods,
            totalFoods,
            totalPages,
            currentPage: page,
        };

    } catch (error) {
      console.error("Repository Search Error:", error);
      throw new Error(
        `Failed to search foods: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
