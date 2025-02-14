import { IEmployee, IRegisterEmployee } from "../../entities/employee.entity";
import { IsAuthenticatedUseCaseRES } from "../common/IIsAuthenticated";

export interface IEmployeeUseCase {
    registerEmployee(employeeData: IRegisterEmployee): Promise<any>;
    verifyOtp(email: string, otp: string): Promise<any>;
    loginEmployee( email: string, password: string ): Promise<{ accessToken: string; refreshToken: string }>
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, password: string): Promise<void>;
    isAuthenticated( token: string | undefined ): Promise<IsAuthenticatedUseCaseRES>
    searchEmployee(searchTerm:string, filterStatus:string | undefined, page:number, limit:number )
        :Promise<{
          employee: IEmployee[];
          totalEmployees:number;
          totalPages: number;
          currentPage: number;
        }>
  }