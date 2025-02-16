import { IFood } from "../../entities/food.entity";

export default interface IFoodUseCase{
    addFood(foodData: IFood):Promise<any>
}