import express from "express";
import { UserController } from "../../controllers/userController";
import { UserRepository } from "../../repositories/userRepository";
import { UserUseCase } from "../../usecase/userUseCase";
import { OtpRepository } from "../../repositories/otpRepository";
import { IJWTService } from "../../interfaces/integration/IJwt";
import { JWTService } from "../../integration/jwtServices";
import { IGoogleAuthService } from "../../interfaces/integration/IGoogleVerification";
import { GoogleAuthService } from "../../integration/googleVerification";
import IUserRepository from "../../interfaces/repository/user.Repository";
import IUserUseCase from "../../interfaces/useCase/user.useCase";
import IOtpRepository from "../../interfaces/repository/otp.Repository";
import AuthMiddleware from "../../middleware/authenticateToken";
import { upload } from "../../middleware/claudinaryUpload";

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
const authMiddleware = new AuthMiddleware("user",iJwtService);
const userUseCase:IUserUseCase = new UserUseCase( userRepository, otpRepository, emailConfig ,iJwtService, googleAuthService);
const userController = new UserController(userUseCase);

//PublicRoute
userRoute
  .get('/isAuthenticate',userController.isAuthenticated.bind(userController))
  .post('/register',userController.registerUser.bind(userController))
  .post('/login',userController.userLogin.bind(userController))
  .post('/google-login',userController.googleLogin.bind(userController))
  .post('/verifyOtp',userController.verifyOtp.bind(userController))
  .post('/resendOtp',userController.resendOtp.bind(userController))
  .post('/forgotPassword',userController.forgotPassword.bind(userController));


//middleware
userRoute.use(authMiddleware.authenticateToken.bind(authMiddleware));

//ProtectedRoute
userRoute
  .get('/getUsers',userController.getUsers.bind(userController))
  .get('/showProfile',userController.showProfile.bind(userController))
  .put('/updateProfile',  userController.updateProfile.bind(userController))
  .put('/profileImage', upload.single('img'), userController.updateProfileImage.bind(userController))
  .post('/resetPassword',userController.resetPassword.bind(userController))
  .post('/logOut',userController.logOut.bind(userController))


export default userRoute;
