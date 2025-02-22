import IOTP from "../entities/otp.entity";

export default interface IOtpRepository {
  createOtp(email: string, otp: string): Promise<IOTP>;
  findOtp(email: string): Promise<{ otp: string } | null>;
  deleteOtp(email: string): Promise<void>;
}
