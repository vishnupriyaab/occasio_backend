import IOTP from "../../interfaces/entities/otp.entity";
import Otp from "../../models/otpModel";
import IOtpRepository from "../../interfaces/repository/otp.Repository";
import CommonBaseRepository from "../baseRepository/commonBaseRepository";

export class OtpRepository
  extends CommonBaseRepository<{ otp: IOTP & Document }>
  implements IOtpRepository
{
  constructor() {
    super({ otp: Otp });
  }

  async createOtp(email: string, otp: string): Promise<IOTP> {
    try {
      await this.deleteOtp(email);
      return await this.createData("otp", { email, otp });
      // const otpEntry = new Otp({ email, otp });
      // return await otpEntry.save();
    } catch (error) {
      throw error;
    }
  }

  async findOtp(email: string): Promise<IOTP | null> {
    try {
      return await this.findOne("otp", { email });
      // return await Otp.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async deleteOtp(email: string): Promise<void> {
    try {
      await this.models.otp.deleteMany({ email });
      // await Otp.deleteMany({ email });
    } catch (error) {
      throw error;
    }
  }
}
