import { Router } from "express";
import { userEventController } from "../controllers/management/userController/eventController";
import { userAuthController } from "../controllers/management/userController/authController";
import { IJWTService } from "../interfaces/integration/IJwt";
import { JWTService } from "../integration/jwtServices";
import AuthMiddleware from "../middleware/authenticateToken";
import { userProfController } from "../controllers/management/userController/profileController";
import { upload } from "../middleware/claudinaryUpload";

const userRouter = Router();
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("user", iJwtServices);

//private - routes
userRouter
  .get("/getEvent", userEventController.getEvent.bind(userEventController))
  .get("/isAuthenticate", userAuthController.isAuthenticated.bind(userAuthController))
  .post("/register", userAuthController.registerUser.bind(userAuthController))
  .post("/login", userAuthController.userLogin.bind(userAuthController))
  .post("/google-login", userAuthController.googleLogin.bind(userAuthController))
  .post("/verifyOtp", userAuthController.verifyOtp.bind(userAuthController))
  .post("/resendOtp", userAuthController.resendOtp.bind(userAuthController))
  .post("/forgotPassword", userAuthController.forgotPassword.bind(userAuthController));

// Protected routes (middleware applied)
userRouter.use(authMiddleware.authenticateToken.bind(authMiddleware));
userRouter
    .post( "/logOut", userAuthController.logOut.bind(userAuthController))
    .get( "/showProfile", userProfController.showProfile.bind(userProfController))
    .put( "/updateProfile", userProfController.updateProfile.bind(userProfController))
    .put( "/profileImage", upload.single("img"), userProfController.updateProfileImage.bind(userProfController))


export default userRouter;
