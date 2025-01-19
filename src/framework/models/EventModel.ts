import mongoose, { Schema } from "mongoose";
import { IEvent } from "../../entities/event.entity";

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

const Event = mongoose.model<IEvent>("Events", eventSchema);
export default Event;
