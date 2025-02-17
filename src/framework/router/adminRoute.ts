import express from "express"
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

const adminRepository:IAdminRepository = new AdminRepository();
const iJwtServices:IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("admin", iJwtServices);
const adminUseCase:IAdminUseCase = new AdminUseCase(adminRepository,iJwtServices);
const adminController:IAdminController = new AdminController(adminUseCase);

  adminRoute.post('/login',adminController.adminLogin.bind(adminController));

  adminRoute.get('/isAuthenticate',adminController.isAuthenticated.bind(adminController));

  adminRoute.use(authMiddleware.authenticateToken.bind(authMiddleware));
  
  adminRoute.patch('/blockUser/:id',adminController.blockUsers.bind(adminController));

  adminRoute.post('/logOut',adminController.logOut.bind(adminController));

  adminRoute.get('/searchEmployee',adminController.searchEmployee.bind(adminController));

  adminRoute.patch('/blockEmployee/:id',adminController.blockEmployee.bind(adminController));


export default adminRoute;