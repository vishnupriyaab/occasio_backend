import mongoose from "mongoose";

export interface IEmployee {
  _id: string;
  name: string;
  email: string;
  mobile: number;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isBlocked: boolean;
  isVerified:boolean;
  resetPasswordToken: string;
  isEmployee?: "Approved" | "Pending" | "Rejected";
}

export interface IRegisterEmployee {
  name: string;
  email: string;
  mobile: number;
  password: string;
}
