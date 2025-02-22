import mongoose, { Schema } from "mongoose";
import { IFood } from "../interfaces/entities/food.entity";

const foodSchema: Schema = new Schema<IFood>(
  {
    foodName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Vegetarian", "Non-vegetarian"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
    },
    foodSection: {
      type: String,
      enum: ["Welcome Drink", "Main Food", "Dessert"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Not Available"],
      default: "Available",
    },
  },
  { timestamps: true }
);

const Food = mongoose.model<IFood & Document>("Foods", foodSchema);
export default Food;
