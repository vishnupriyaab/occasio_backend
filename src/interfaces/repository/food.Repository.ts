import { IAddFood, IFood } from "../../entities/food.entity";

export default interface IFoodRepository{
    addFood(food:IAddFood):Promise<IFood | void>
    updateFood(id: string, updatedData: IAddFood): Promise<IFood | null>
    findByFoodName(eventName: string): Promise<IFood | null>
    searchFood(
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
      }>
}