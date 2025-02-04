import express from 'express';
import { EmployeeRepository } from '../../repositories/employeeRepository';
import { EmployeeUseCase } from '../../usecase/employeeUseCase';
import { EmployeeController } from '../../controllers/employeeController';
import { OtpRepository } from '../../repositories/otpRepository';
import { JWTService } from '../utils/jwtServices';
import { ICryptoService } from '../../interfaces/utils/ICrypto';
import { CryptoService } from '../utils/cryptoServices';
import { IJWTService } from '../../interfaces/utils/IJwt';
import IEmployeeRepository from '../../interfaces/repository/employee.Repository';
import IOtpRepository from '../../interfaces/repository/otp.Repository';
import { IEmployeeUseCase } from '../../interfaces/useCase/employee.useCase';
import IEmployeeController from '../../interfaces/controller/employee.controller';


const employeeRoute = express.Router()

const emailConfig = {
  user: process.env.EMAIL_COMPANY,
  pass: process.env.EMAIL_PASS,
  frontendUrl: process.env.FRONTEND_URL
};

const employeeRepository:IEmployeeRepository = new EmployeeRepository();
const otpRepository:IOtpRepository = new OtpRepository()
const IjwtService:IJWTService = new JWTService()
const iCryptoService:ICryptoService = new CryptoService();
const employeeUseCase:IEmployeeUseCase = new EmployeeUseCase(employeeRepository,otpRepository,emailConfig,IjwtService,iCryptoService);
const employeeController:IEmployeeController = new EmployeeController(employeeUseCase)


employeeRoute.post('/register',employeeController.registerEmployee.bind(employeeController));

employeeRoute.post('/login',employeeController.employeeLogin.bind(employeeController));

employeeRoute.post('/verifyEmployeeOtp',employeeController.verifyOtp.bind(employeeController));

employeeRoute.post('/forgotPassword',employeeController.forgotPassword.bind(employeeController));

employeeRoute.post('/resetPassword',employeeController.resetPassword.bind(employeeController));

employeeRoute.get('/isAuthenticate',employeeController.isAuthenticated.bind(employeeController));

employeeRoute.post('/logOut',employeeController.logOut.bind(employeeController));


export default employeeRoute;