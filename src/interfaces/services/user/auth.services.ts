import { otpResponse } from "../../../entities/otp.entity";
import { IRegisterUser } from "../../../entities/user.entity";
import { IsAuthenticatedUseCaseRES } from "../../common/IIsAuthenticated";

export default interface IUserAuthService {
  registerUser(user: IRegisterUser): Promise<IRegisterUser | null>;
  verifyOtp(email: string, otp: string): Promise<otpResponse>;
  resendOtp(email: string): Promise<otpResponse>;
  loginUser( email: string, password: string ): Promise<{ accessToken: string; refreshToken: string }>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  googleLogin( token: string ): Promise<{ accessToken: string; refreshToken: string }>;
  isAuthenticated( token: string | undefined ): Promise<IsAuthenticatedUseCaseRES>
  
}
