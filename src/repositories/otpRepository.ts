import IOTP from "../entities/otp.entity";
import Otp from "../framework/models/otpModel";
import { IOtpRepository } from "../interfaces/IOtp";

export class OtpRepository implements IOtpRepository {
  async createOtp(email: string, otp: string): Promise<IOTP> {
    const otpEntry = new Otp({ email, otp });
    return await otpEntry.save();
    // return otpEntry;
  }
  async findOtp(email: string): Promise<IOTP | null> {
    return await Otp.findOne({ email });
 }
 async deleteOtp(email:string): Promise<void> {
    await Otp.deleteMany({ email });
 }
}
