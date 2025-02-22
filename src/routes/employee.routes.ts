import express from "express"
import { emplAuthController } from "../controllers/management/employeeController/authController"
import { JWTService } from "../integration/jwtServices";
import { IJWTService } from "../interfaces/integration/IJwt";
import AuthMiddleware from "../middleware/authenticateToken";
import { emplProfileController } from "../controllers/management/employeeController/profileController";
import { upload } from "../middleware/claudinaryUpload";
import { emplFoodController } from "../controllers/management/employeeController/foodController";

const employeeRouter = express.Router()
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("employee", iJwtServices);

//private - routes
employeeRouter
    .post( "/register", emplAuthController.registerEmployee.bind(emplAuthController))
    .post( "/verifyEmployeeOtp", emplAuthController.verifyOtp.bind(emplAuthController))
    .post( "/login", emplAuthController.employeeLogin.bind(emplAuthController))
    .post( "/forgotPassword", emplAuthController.forgotPassword.bind(emplAuthController))
    .post( "/resetPassword", emplAuthController.resetPassword.bind(emplAuthController))
    .get( "/isAuthenticate", emplAuthController.isAuthenticated.bind(emplAuthController))

// Protected routes (middleware applied)
employeeRouter.use(authMiddleware.authenticateToken.bind(authMiddleware));
employeeRouter
    .post( "/logOut", emplAuthController.logOut.bind(emplAuthController))
    .get( "/showProfile", emplProfileController.showProfile.bind(emplProfileController))
    .put( "/updateProfile", emplProfileController.updateProfile.bind(emplProfileController))
    .put( "/profileImage", upload.single("img"), emplProfileController.updateProfileImage.bind(emplProfileController))
    .get('/searchFood',emplFoodController.SearchFood.bind(emplFoodController))
    .post('/addFood', emplFoodController.addFood.bind(emplFoodController))
    .put('/editFood/:id', emplFoodController.editFood.bind(emplFoodController))


export default employeeRouter;