import { otpResponse } from "../../entities/otp.entity";
import { IProfile, IRegisterUser, IUser } from "../../entities/user.entity";
import { IsAuthenticatedUseCaseRES } from "../common/IIsAuthenticated";

export default interface IUserUseCase {
    registerUser(user: IRegisterUser): Promise<IRegisterUser | null>
    verifyOtp(email: string, otp: string): Promise<otpResponse>
    resendOtp(email: string): Promise<otpResponse>
    loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, password: string): Promise<void>;
    googleLogin(credential:any):Promise<{ accessToken: string; refreshToken: string }>;
    getAllUsers():Promise<IUser[]>;
    isAuthenticated(token: string | undefined): Promise<IsAuthenticatedUseCaseRES>
    showProfile(userId: string): Promise<IProfile>
    updateProfileImage(image:string, userId: string):Promise<any>
    updateProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null>
  }
  