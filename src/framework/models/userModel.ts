import mongoose, { Schema } from "mongoose";
import { IUser } from "../../entities/user.entity";

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

const Users = mongoose.model<IUser>("Users", userSchema);

export default Users;
