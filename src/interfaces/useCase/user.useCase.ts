import { otpResponse } from "../../entities/otp.entity";
import { IRegisterUser, IUser } from "../../entities/user.entity";
import { IsAuthenticatedUseCaseRES } from "../common/IIsAuthenticated";

export default interface IUserUseCase {
    registerUser(user: IRegisterUser): Promise<IRegisterUser | null>
    verifyOtp(email: string, otp: string): Promise<otpResponse>
    resendOtp(email: string): Promise<otpResponse>
    loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, password: string): Promise<void>;
    execute(credential:any):Promise<{ accessToken: string; refreshToken: string }>;
    getAllUsers():Promise<IUser[]>;
    isAuthenticated(token: string | undefined): Promise<IsAuthenticatedUseCaseRES>
    searchUser(searchTerm:string, filterStatus:string | undefined, page:number, limit:number )
    :Promise<{
      users: IUser[];
      totalUsers:number;
      totalPages: number;
      currentPage: number;
    }>
  }
  