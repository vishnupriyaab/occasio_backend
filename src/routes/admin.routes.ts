import { Router } from "express";
import { adminAuthController } from "../controllers/management/adminController/authController";
import { JWTService } from "../integration/jwtServices";
import { IJWTService } from "../interfaces/integration/IJwt";
import AuthMiddleware from "../middleware/authenticateToken";
import { adminUserController } from "../controllers/management/adminController/userController";
import { adminEmployeeController } from "../controllers/management/adminController/employeeController";

const adminRouter = Router();
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("admin", iJwtServices);


//private - routes
adminRouter
    .post( "/login", adminAuthController.adminLogin.bind(adminAuthController))
    .get( "/isAuthenticate", adminAuthController.isAuthenticated.bind(adminAuthController));


// Protected routes (middleware applied)
adminRouter.use(authMiddleware.authenticateToken.bind(authMiddleware));
adminRouter
    .post( "/logOut", adminAuthController.logOut.bind(adminAuthController))
    .patch( "/blockUser/:id", adminUserController.blockUsers.bind(adminUserController))
    .get( "/searchUser", adminUserController.searchUser.bind(adminUserController))
    .patch( "/blockEmployee/:id", adminEmployeeController.blockEmployee.bind(adminEmployeeController))
    .get( "/searchEmployee", adminEmployeeController.searchEmployee.bind(adminEmployeeController))
    

export default adminRouter;