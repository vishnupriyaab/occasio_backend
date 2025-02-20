import mongoose, { Schema } from "mongoose";
import IOTP from "../entities/otp.entity";

const OtpSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Otp = mongoose.model<IOTP>("OTP", OtpSchema);
export default Otp;
