import express, { NextFunction, Request, Response } from "express"
import { AdminRepository } from "../../repositories/adminRepository";
import { AdminUseCase } from "../../usecase/adminUseCase";
import { AdminController } from "../../controllers/adminController";
import { JWTService } from "../utils/jwtServices";

const adminRoute = express.Router();


const adminRepository = new AdminRepository();
const jwtServices = new JWTService
const adminUseCase = new AdminUseCase(adminRepository,jwtServices);
const adminController = new AdminController(adminUseCase,jwtServices);


const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
  };


  adminRoute.post( '/login', asyncHandler(async (req: Request, res: Response) => {  return await adminController.adminLogin(req, res) }) );
  adminRoute.patch( '/blockUser/:id', asyncHandler(async (req: Request, res: Response) => {  return await adminController.blockUsers(req, res) }) );


export default adminRoute;