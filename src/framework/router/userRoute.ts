import express from "express";
import { UserController } from "../../controllers/userController";
import { UserRepository } from "../../repositories/userRepository";
import { UserUseCase } from "../../usecase/userUseCase";
import { OtpRepository } from "../../repositories/otpRepository";
import { Request, Response, NextFunction } from "express";
import { IUserUseCase } from "../../interfaces/IUser";
import { IOtpRepository } from "../../interfaces/IOtp";
import { IJWTService } from "../../interfaces/IJwt";
import { JWTService } from "../utils/jwtServices";

const userRoute = express.Router();

const emailConfig = {
  user: process.env.EMAIL_COMPANY,
  pass: process.env.EMAIL_PASS,
  frontendUrl: process.env.FRONTEND_URL
};

const userRepository = new UserRepository();
const iJwtService:IJWTService = new JWTService()
const otpRepository: IOtpRepository = new OtpRepository();
const userUseCase:IUserUseCase = new UserUseCase( userRepository, otpRepository, emailConfig ,iJwtService);
const userController = new UserController(userUseCase);


const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Route definitions
userRoute.post( '/register', asyncHandler(async (req: Request, res: Response) => {  return await userController.registerUser(req, res) }) );

userRoute.post( '/verifyOtp', asyncHandler(async (req: Request, res: Response) => {  return await userController.verifyOtp(req, res) }) );

userRoute.post( '/forgotPassword', asyncHandler(async (req: Request, res: Response) => {  return await userController.forgotPassword(req, res) }) );

userRoute.post( '/resetPassword', asyncHandler(async (req: Request, res: Response) => {  return await userController.resetPassword(req, res) }) );

userRoute.post( '/login', asyncHandler(async (req: Request, res: Response) => {  return await userController.userLogin(req, res) }) );

userRoute.post( '/google-login', asyncHandler(async (req: Request, res: Response) => {  return await userController.googleLogin(req, res) }) );

export default userRoute;
