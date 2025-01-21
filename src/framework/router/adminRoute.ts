import express, { NextFunction, Request, Response } from "express"
import { AdminRepository } from "../../repositories/adminRepository";
import { AdminUseCase } from "../../usecase/adminUseCase";
import { AdminController } from "../../controllers/adminController";
import { JWTService } from "../utils/jwtServices";
import { IAdminController, IAdminRepository, IAdminUseCase } from "../../interfaces/IAdmin";
import { IJWTService } from "../../interfaces/IJwt";

const adminRoute = express.Router();


const adminRepository:IAdminRepository = new AdminRepository();
const iJwtServices:IJWTService = new JWTService();
const adminUseCase:IAdminUseCase = new AdminUseCase(adminRepository,iJwtServices);
const adminController:IAdminController = new AdminController(adminUseCase);


  adminRoute.post('/login',adminController.adminLogin.bind(adminController));
  
  adminRoute.patch('/blockUser/:id',adminController.blockUsers.bind(adminController));

  adminRoute.post('/logOut',adminController.logOut.bind(adminController));

  adminRoute.get('/isAuthenticate',adminController.isAuthenticated.bind(adminController));


export default adminRoute;