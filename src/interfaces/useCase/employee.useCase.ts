import { IEmployee, IRegisterEmployee } from "../../entities/employee.entity";
import { IProfile } from "../../entities/user.entity";
import { IsAuthenticatedUseCaseRES } from "../common/IIsAuthenticated";

export interface IEmployeeUseCase {
    registerEmployee(employeeData: IRegisterEmployee): Promise<any>;
    verifyOtp(email: string, otp: string): Promise<any>;
    loginEmployee( email: string, password: string ): Promise<{ accessToken: string; refreshToken: string }>
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, password: string): Promise<void>;
    isAuthenticated( token: string | undefined ): Promise<IsAuthenticatedUseCaseRES>
    showProfile(userId: string): Promise<IProfile>
    updateProfile(userId: string, updateData: Partial<IEmployee>): Promise<IEmployee | null>
    updateProfileImage(image:string, userId: string):Promise<IEmployee | null>
  }