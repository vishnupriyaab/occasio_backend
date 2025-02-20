import { IRegisterEmployee } from "../../../entities/employee.entity";
import { IsAuthenticatedUseCaseRES } from "../../common/IIsAuthenticated";

export default interface IEmplAuthService {
  registerEmployee( employee: IRegisterEmployee ): Promise<IRegisterEmployee | null>;
  verifyOtp(email: string, otp: string): Promise<any>;
  loginEmployee( email: string, password: string ): Promise<{ accessToken: string; refreshToken: string }>
  forgotPassword(email: string): Promise<void>
  resetPassword(token: string, newPassword: string): Promise<void>
  isAuthenticated( token: string | undefined ): Promise<IsAuthenticatedUseCaseRES>
}
