import mongoose, { Schema } from "mongoose";
import { IPackage } from "../../entities/package.entity";

export const PackageItemSchema: Schema = new Schema({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
});

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
    items: {
      type: [PackageItemSchema],
    },
    image: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Package = mongoose.model<IPackage>("Packages", packageSchema);
export default Package;
