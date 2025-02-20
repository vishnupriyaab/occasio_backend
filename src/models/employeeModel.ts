import mongoose, { Schema } from "mongoose";
import { IEmployee } from "../entities/employee.entity";

const employeeSchema: Schema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    password: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isEmployee: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Employees = mongoose.model<IEmployee & Document>("Employees", employeeSchema);
export default Employees;
