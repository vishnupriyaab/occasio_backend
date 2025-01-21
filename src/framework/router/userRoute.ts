import express from "express";
import { UserController } from "../../controllers/userController";
import { UserRepository } from "../../repositories/userRepository";
import { UserUseCase } from "../../usecase/userUseCase";
import { OtpRepository } from "../../repositories/otpRepository";
import { IUserController, IUserRepository, IUserUseCase } from "../../interfaces/IUser";
import { IOtpRepository } from "../../interfaces/IOtp";
import { IJWTService } from "../../interfaces/IJwt";
import { JWTService } from "../utils/jwtServices";
import { IGoogleAuthService } from "../../interfaces/IGoogleVerification";
import { GoogleAuthService } from "../utils/googleVerification";

const userRoute = express.Router();

const emailConfig = {
  user: process.env.EMAIL_COMPANY,
  pass: process.env.EMAIL_PASS,
  frontendUrl: process.env.FRONTEND_URL
};

const userRepository:IUserRepository = new UserRepository();
const iJwtService:IJWTService = new JWTService();
const otpRepository: IOtpRepository = new OtpRepository();
const googleAuthService: IGoogleAuthService = new GoogleAuthService(
  process.env.GOOGLE_AUTH_CLIENT_ID as string
);
const userUseCase:IUserUseCase = new UserUseCase( userRepository, otpRepository, emailConfig ,iJwtService, googleAuthService);
const userController:IUserController = new UserController(userUseCase);


userRoute.post('/register',userController.registerUser.bind(userController));

userRoute.post('/login',userController.userLogin.bind(userController));

userRoute.post('/google-login',userController.googleLogin.bind(userController));

userRoute.post('/logOut',userController.logOut.bind(userController));

userRoute.post('/forgotPassword',userController.forgotPassword.bind(userController));

userRoute.post('/resetPassword',userController.resetPassword.bind(userController));

userRoute.post('/verifyOtp',userController.verifyOtp.bind(userController));

userRoute.get('/isAuthenticate',userController.isAuthenticated.bind(userController));

userRoute.get('/getUsers',userController.getUsers.bind(userController));


export default userRoute;
