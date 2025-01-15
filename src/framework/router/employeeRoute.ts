import express, { NextFunction, Request, Response } from 'express';
import { EmployeeRepository } from '../../repositories/employeeRepository';
import { EmployeeUseCase } from '../../usecase/employeeUseCase';
import { EmployeeController } from '../../controllers/employeeController';
import { OtpRepository } from '../../repositories/otpRepository';
import { JWTService } from '../utils/jwtServices';


const employeeRoute = express.Router()

const emailConfig = {
  user: process.env.EMAIL_COMPANY,
  pass: process.env.EMAIL_PASS,
  frontendUrl: process.env.FRONTEND_URL
};

const employeeRepository = new EmployeeRepository();
const otpRepository = new OtpRepository()
const IjwtService = new JWTService()
const employeeUseCase = new EmployeeUseCase(employeeRepository,otpRepository,emailConfig,IjwtService);
const employeeController = new EmployeeController(employeeUseCase,IjwtService)

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
  };
};

employeeRoute.post( '/register', asyncHandler(async (req: Request, res: Response) => {  return await employeeController.registerEmployee(req, res) }) );
employeeRoute.post( '/login', asyncHandler(async (req: Request, res: Response) => {  return await employeeController.employeeLogin(req, res) }) );
employeeRoute.post( '/verifyEmployeeOtp', asyncHandler(async (req: Request, res: Response) => {  return await employeeController.verifyOtp(req, res) }) );
employeeRoute.post( '/forgotPassword', asyncHandler(async (req: Request, res: Response) => {  return await employeeController.forgotPassword(req, res) }) );
employeeRoute.post( '/resetPassword', asyncHandler(async (req: Request, res: Response) => {  return await employeeController.resetPassword(req, res) }) );


export default employeeRoute;