import { Request, Response } from "express";
import { IRegisterUser, IUser } from "../entities/user.entity";
import { IsAuthenticatedUseCaseRES } from "./IIsAuthenticated";

export interface IUserController {
  registerUser(req: Request, res: Response): Promise<Response | void>
  verifyOtp(req: Request, res: Response): Promise<Response | void>
  forgotPassword(req: Request, res: Response): Promise<Response | void>
  resetPassword(req: Request, res: Response): Promise<Response | void>
  userLogin(req: Request, res: Response): Promise<Response | void>
  googleLogin(req: Request, res: Response): Promise<Response | void>
  getUsers(req: Request, res: Response): Promise<void>
  logOut(req: Request, res: Response): Promise<void>
  isAuthenticated(req: Request, res: Response): Promise<void>
}

export interface IUserUseCase {
  registerUser(userData: IRegisterUser): Promise<any>;
  verifyOtp(email: string, otp: string): Promise<any>;
  loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  execute(credential:any):Promise<{ accessToken: string; refreshToken: string }>;
  getAllUsers():Promise<IUser[]>;
  isAuthenticated(token: string | undefined): Promise<IsAuthenticatedUseCaseRES>
}

export interface IUserRepository {
  createUser(user: IRegisterUser): Promise<IRegisterUser>;
  findByEmail(email: string): Promise<IUser | null>;
  updateUserStatus( email: string, isVerified: boolean ): Promise<IUser | null>
  updateActivatedStatus(email:string, isActivated:boolean):Promise <IUser | null>
  findUserByEmail(email: string): Promise<IUser | null>
  savePasswordResetToken(userId: string, token: string): Promise<void>
  findUserById(userId: string): Promise<IUser | null>
  updatePassword(userId: string, hashedPassword: string): Promise<void>
  getPasswordResetToken(userId: string): Promise<string | null>
  clearPasswordResetToken(userId: string): Promise<void>
  createGoogleUser(userData: IUser): Promise<IUser>
  getAllUsers(): Promise<IUser[]>
}