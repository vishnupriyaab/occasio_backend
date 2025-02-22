import mongoose, { Schema } from "mongoose";
import { IPackage } from "../interfaces/entities/package.entity";

const packageSchema: Schema = new Schema<IPackage>(
  {
    eventId: {
      type: String,
      required: true,
    },
    packageName: {
      type: String,
      required: true,
    },
    startingAmnt: {
      type: Number,
    },
    items: [
      {
        name: {
          type: String,
        },
        isBlocked: {
          type: Boolean,
          default: false,
        },
        amount: {
          type: Number,
        },
      },
    ],
    image: {
      type: String,
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Package = mongoose.model<IPackage & Document>("Packages", packageSchema);
export default Package;
