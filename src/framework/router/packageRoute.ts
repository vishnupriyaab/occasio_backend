import { PackageController } from "../../controllers/packageController";
import { PackageRepository } from "../../repositories/packageRepository";
import { PackageUseCase } from "../../usecase/packageUseCase";
import express, { NextFunction, Request, Response } from 'express';
import { upload } from "../middlewares/claudinaryUpload";

const packageRoute = express.Router()

const packageRepo = new PackageRepository()
const packageUseCase = new PackageUseCase(packageRepo);
const packageController = new PackageController();


const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
  }; 



export default packageRoute;