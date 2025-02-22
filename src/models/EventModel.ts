import mongoose, { Schema } from "mongoose";
import { IEvent } from "../interfaces/entities/event.entity";

const eventSchema: Schema = new Schema<IEvent>(
  {
    eventName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent & Document>("Events", eventSchema);
export default Event;
