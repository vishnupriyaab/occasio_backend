import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/entities/user.entity";

const userSchema: Schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
    },
    imageUrl: {
      type: String,
    },
    password: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActivated: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
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

const Users = mongoose.model<IUser & Document>("Users", userSchema);

export default Users;
