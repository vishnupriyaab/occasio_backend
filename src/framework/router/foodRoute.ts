import express from "express";
import IFoodRepository from "../../interfaces/repository/food.Repository";
import { FoodRepository } from "../../repositories/foodRepository";
import IFoodUseCase from "../../interfaces/useCase/food.useCase";
import { FoodUseCase } from "../../usecase/foodUseCase";
import { IFoodController } from "../../interfaces/controller/food.controller";
import { FoodController } from "../../controllers/foodController";

const foodRoute = express.Router();

const foodRepository: IFoodRepository = new FoodRepository();
const foodUseCase: IFoodUseCase = new FoodUseCase(foodRepository);
const foodController: IFoodController = new FoodController(foodUseCase);

foodRoute.post('/addFood', foodController.addFood.bind(foodController));


export default foodRoute;   