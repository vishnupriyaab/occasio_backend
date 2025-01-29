import IOTP from "../entities/otp.entity";
import Otp from "../framework/models/otpModel";
import IOtpRepository from "../interfaces/repository/otp.Repository";

export class OtpRepository implements IOtpRepository {
  async createOtp(email: string, otp: string): Promise<IOTP> {
    try {
      const otpEntry = new Otp({ email, otp });
      return await otpEntry.save();
    } catch (error) {
      throw error;
    }
  }

  async findOtp(email: string): Promise<IOTP | null> {
    try {
      return await Otp.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async deleteOtp(email: string): Promise<void> {
    try {
      await Otp.deleteMany({ email });
    } catch (error) {
      throw error;
    }
  }
}
