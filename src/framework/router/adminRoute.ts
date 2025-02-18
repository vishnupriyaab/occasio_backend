import express from "express";
import { AdminRepository } from "../../repositories/adminRepository";
import { AdminUseCase } from "../../usecase/adminUseCase";
import { AdminController } from "../../controllers/adminController";
import { JWTService } from "../utils/jwtServices";
import { IJWTService } from "../../interfaces/utils/IJwt";
import IAdminRepository from "../../interfaces/repository/admin.Repository";
import IAdminUseCase from "../../interfaces/useCase/admin.useCase";
import IAdminController from "../../interfaces/controller/admin.controller";
import AuthMiddleware from "../middlewares/authenticateToken";

const adminRoute = express.Router();

const adminRepository: IAdminRepository = new AdminRepository();
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("admin", iJwtServices);
const adminUseCase: IAdminUseCase = new AdminUseCase(
  adminRepository,
  iJwtServices
);
const adminController: IAdminController = new AdminController(adminUseCase);

adminRoute
  .post("/login", adminController.adminLogin.bind(adminController))
  .get( "/isAuthenticate", adminController.isAuthenticated.bind(adminController));

//middleware
adminRoute.use(authMiddleware.authenticateToken.bind(authMiddleware));

adminRoute
  .get("/searchEmployee", adminController.searchEmployee.bind(adminController))
  .patch("/blockUser/:id", adminController.blockUsers.bind(adminController))
  .post("/logOut", adminController.logOut.bind(adminController))
  .patch("/blockEmployee/:id", adminController.blockEmployee.bind(adminController))
  .get("/searchUser", adminController.searchUser.bind(adminController));

export default adminRoute;