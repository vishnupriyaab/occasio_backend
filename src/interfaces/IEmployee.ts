import { Request, Response } from "express";
import { IEmployee, IRegisterEmployee } from "../entities/employee.entity";

export interface IEmployeeController {
  registerEmployee(req: Request, res: Response): Promise<Response | void>;
  verifyOtp(req: Request, res: Response): Promise<Response | void>;
  employeeLogin(req: Request, res: Response): Promise<Response | void>;
  forgotPassword(req: Request, res: Response): Promise<Response | void>;
  resetPassword(req: Request, res: Response): Promise<Response | void>;
}

export interface IEmployeeUseCase {
  registerEmployee(employeeData: IRegisterEmployee): Promise<any>;
  verifyOtp(email: string, otp: string): Promise<any>;
  findEmployeeByEmail(email: string): Promise<any>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
}

export interface IEmployeeRepository {
  findEmployeeById(employeeId:string):Promise<any>;
  findByEmail(email: string): Promise<IEmployee | null>;
  updateEmployeeStatus(email: string,status:boolean): Promise<IEmployee | null>;
  createEmployee(employee: IRegisterEmployee): Promise<IEmployee | never>;
  findEmployeeByEmail(email: string): Promise<IEmployee | null>;
  savePasswordResetToken(employeeId: string, token: string): Promise<void>;
  getPasswordResetToken(employeeId: string): Promise<string | null>;
  updatePassword(employeeId: string, hashedPassword: string): Promise<void>;
  clearPasswordResetToken(employeeId: string): Promise<void>;
}
