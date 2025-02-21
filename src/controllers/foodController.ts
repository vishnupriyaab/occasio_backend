import { Request, Response } from "express";
import IFoodUseCase from "../interfaces/useCase/food.useCase";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import { handleError, handleSuccess } from "../integration/responseHandler";
import { ResponseMessage } from "../constant/responseMsg";

export class FoodController {
  constructor(private foodUseCase: IFoodUseCase) {}
  async addFood(req: Request, res: Response): Promise<void> {
    try {
      const { foodName, category, price, foodSection, status } = req.body;
      console.log(
        foodName,
        category,
        price,
        foodSection,
        status,
        "sedrftgyhujikol"
      );

      if (!foodName || !category || !price || !foodSection || !status) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(
            handleError(
              ResponseMessage.FIELDS_REQUIRED,
              HttpStatusCode.BAD_REQUEST
            )
          );
        return;
      }
      const food = await this.foodUseCase.addFood({
        foodName,
        category,
        price,
        foodSection,
        status,
      });

      res
        .status(HttpStatusCode.CREATED)
        .json(
          handleSuccess(
            ResponseMessage.FOOD_CREATED,
            HttpStatusCode.CREATED,
            food
          )
        );
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.FOOD_CREATION_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }
  async editFood(req: Request, res: Response): Promise<void> {
    try {
      const foodId = req.params.id;
      const foodData = req.body;
      console.log(foodId, foodData, "wertyui");
      const updateFood = await this.foodUseCase.updateFood(foodId, foodData);
      res
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(
            ResponseMessage.FOOD_UPDATED,
            HttpStatusCode.OK,
            updateFood
          )
        );
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.FOOD_UPDATE_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
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

      if (isNaN(page) || isNaN(limit)) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(
            handleError(
              "Invalid page or limit parameters",
              HttpStatusCode.BAD_REQUEST
            )
          );
        return;
      }

      const result = await this.foodUseCase.searchFood(
        searchTerm,
        status,
        price,
        category,
        session,
        page,
        limit
      );
      console.log(result, "qwertyui");
      res
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(ResponseMessage.FETCH_FOOD, HttpStatusCode.OK, result)
        );
    } catch (error) {
      console.error("Search Food Error:", error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.FETCH_FOOD_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }
}
