import { IAddFood, IFood } from "../../../entities/food.entity";

export default interface IEmplFoodRepository {
  findByFoodName(foodName: string): Promise<IFood | null>;
  addFood(food: IAddFood): Promise<IFood>;
  updateFood(foodId: string, foodData: Partial<IFood>): Promise<IFood | null>;
  searchFood(
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
}> 
}
