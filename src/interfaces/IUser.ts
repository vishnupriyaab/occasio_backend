import { Request, Response } from "express";
import { IRegisterUser, IUser } from "../entities/user.entity";

export interface IUserController {
  registerUser(req: Request, res: Response): Promise<Response | void>;
  verifyOtp(req: Request, res: Response): Promise<Response | void>;
  userLogin(req: Request, res: Response): Promise<Response | void>;
  forgotPassword(req: Request, res: Response): Promise<Response | void>;
  resetPassword(req: Request, res: Response): Promise<Response | void>;
}

export interface IUserUseCase {
  registerUser(userData: IRegisterUser): Promise<any>;
  verifyOtp(email: string, otp: string): Promise<any>;
  // findUserByEmail(email: string): Promise<any>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  execute(credential:any):Promise<{ accessToken: string; refreshToken: string }>;
  loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>
}

// Interfaces for dependencies
export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  createUser(user: IRegisterUser): Promise<IRegisterUser>;
  updateUserStatus(email: string, status: boolean): Promise<IUser | null>;
  findUserByEmail(email: string): Promise<IUser | null>;
  findUserById(userId: string): Promise<IUser | null>;
  savePasswordResetToken(userId: string, token: string): Promise<void>;
  getPasswordResetToken(userId: string): Promise<string | null>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  clearPasswordResetToken(userId: string): Promise<void>;
  // checkUser(email: string): Promise<IUser | null>
  createGoogleUser(userData:any): Promise<IUser>
  // createGoo
}