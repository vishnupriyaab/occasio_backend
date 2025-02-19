import mongoose, { Schema } from "mongoose";
import { IAdmin } from "../../entities/admin.entity";

const adminSchema: Schema = new Schema<IAdmin>(
  {
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model<IAdmin & Document>("Admin", adminSchema);

export default Admin;
