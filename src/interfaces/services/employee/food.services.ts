import { IAddFood, IFood } from "../../../entities/food.entity";

export default interface IEmplFoodService{
    addFood(foodData: IFood): Promise<any>
    updateFood(foodId:string, foodData: IAddFood):Promise<IFood | undefined | null>
    searchFood(
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
}