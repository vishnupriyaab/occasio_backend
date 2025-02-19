import express from "express";
import { AdminRepository } from "../../repositories/adminRepository";
import { JWTService } from "../utils/jwtServices";
import { IJWTService } from "../../interfaces/utils/IJwt";
import IAdminRepository from "../../interfaces/repository/admin.Repository";
import AuthMiddleware from "../middlewares/authenticateToken";
import IAdminServices from "../../interfaces/services/admin/admin.services";
import { AdminService } from "../../services/business/adminServices/adminService";
import { AdminController } from "../../controllers/management/adminController/adminController";
import IAdminController from "../../interfaces/controller/admin/admin.controller";

const adminRoute = express.Router();

const adminRepository: IAdminRepository = new AdminRepository();
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("admin", iJwtServices);
const adminServices: IAdminServices = new AdminService( adminRepository, iJwtServices);
const adminController: IAdminController = new AdminController(adminServices);


adminRoute
  .post("/login", adminController.adminLogin.bind(adminController))
  .get(
    "/isAuthenticate",
    adminController.isAuthenticated.bind(adminController)
  );

//middleware
adminRoute.use(authMiddleware.authenticateToken.bind(authMiddleware));

adminRoute
.post("/logOut", adminController.logOut.bind(adminController))
//   .get("/searchEmployee", adminController.searchEmployee.bind(adminController))
//   .patch("/blockUser/:id", adminController.blockUsers.bind(adminController))
//   .patch(
//     "/blockEmployee/:id",
//     adminController.blockEmployee.bind(adminController)
//   )
//   .get("/searchUser", adminController.searchUser.bind(adminController));

export default adminRoute;
