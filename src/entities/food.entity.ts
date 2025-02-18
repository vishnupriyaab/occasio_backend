export interface IFood {
    foodName: string;
    category: "Vegetarian" | "Non-vegetarian";
    price: number;
    quantity?:number;
    foodSection: "Welcome Drink" | "Main Food" | "Dessert";
    status: "Available" | "Not Available";
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface IAddFood {
    foodName: string;
    category: "Vegetarian" | "Non-vegetarian";
    price: number;
    foodSection: "Welcome Drink" | "Main Food" | "Dessert";
    status: "Available" | "Not Available";
  }
  