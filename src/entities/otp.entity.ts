import { IUser } from "./user.entity";

export interface IOTP {
  email: string;
  otp: string;
  createdAt: Date;
}

export default IOTP;

export interface otpResponse {
  success: boolean;
  message: string;
  user: IUser | null;
}
