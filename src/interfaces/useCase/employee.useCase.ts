import { IRegisterEmployee } from "../../entities/employee.entity";

export interface IEmployeeUseCase {
    registerEmployee(employeeData: IRegisterEmployee): Promise<any>;
    verifyOtp(email: string, otp: string): Promise<any>;
    loginEmployee( email: string, password: string ): Promise<{ accessToken: string; refreshToken: string }>
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, password: string): Promise<void>;
  }