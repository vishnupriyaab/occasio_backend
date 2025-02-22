import { Request, Response } from "express";
import IEmplFoodService from "../../../interfaces/services/employee/food.services";
import { emplFoodServices } from "../../../services/business/employeeService/foodService";
import { successResponse } from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";

export class EmplFoodController {
  private foodService: IEmplFoodService;
  constructor(foodService: IEmplFoodService) {
    this.foodService = foodService;
  }

  //addFood
  async addFood(req: Request, res: Response): Promise<void> {
    try {
      const { foodName, category, price, foodSection, status } = req.body;

      if (!foodName || !category || !price || !foodSection || !status) {
        const error = new Error("All fields are required");
        error.name = "AllFieldsAreRequired";
        throw error;
      }
      const food = await this.foodService.addFood({
        foodName,
        category,
        price,
        foodSection,
        status,
      });

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Food created successfully",
        food
      );
    } catch (error: unknown) {}
  }

  //editFood
  async editFood(req: Request, res: Response): Promise<void> {
    try {
      const foodId = req.params.id;
      const foodData = req.body;
      console.log(foodId, foodData, "wertyui");
      const updateFood = await this.foodService.updateFood(foodId, foodData);
      return successResponse(res, HttpStatusCode.OK, 'Food updated successfully', updateFood)
    } catch (error: unknown) {
      
    }
  }

    async SearchFood(req: Request, res: Response): Promise<void> {
      try {
        const searchTerm = (req.query.searchTerm as string | undefined) || "";
        const status = (req.query.status as string | undefined) || "";
        const price = (req.query.price as string | undefined) || "";
        const category = (req.query.category as string | undefined) || "";
        const session = (req.query.session as string | undefined) || "";
  
        console.log(searchTerm, status, price, category, session, "vishnu");
  
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit
          ? parseInt(req.query.limit as string, 10)
          : 10;
  
        
  
        const result = await this.foodService.searchFood(
          searchTerm,
          status,
          price,
          category,
          session,
          page,
          limit
        );
        console.log(result, "qwertyui");

        return successResponse(res, HttpStatusCode.OK, 'Foods fetched successfully', result)
       
      } catch (error: unknown) {
        console.error("Search Food Error:", error);
        
      }
    }

}

export const emplFoodController = new EmplFoodController(emplFoodServices);
