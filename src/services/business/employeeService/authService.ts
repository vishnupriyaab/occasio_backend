import {
  IEmployee,
  IRegisterEmployee,
} from "../../../entities/employee.entity";
import { CryptoService } from "../../../integration/cryptoServices";
import { EmailService } from "../../../integration/emailService";
import { JWTService } from "../../../integration/jwtServices";
import { IsAuthenticatedUseCaseRES } from "../../../interfaces/common/IIsAuthenticated";
import { ICryptoService } from "../../../interfaces/integration/ICrypto";
import { IEmailService } from "../../../interfaces/integration/IEmail";
import { IJWTService, JWTPayload } from "../../../interfaces/integration/IJwt";
import IEmplAuthRepository from "../../../interfaces/repository/employee/empl.auth.respository";
import IOtpRepository from "../../../interfaces/repository/otp.Repository";
import IEmplAuthService from "../../../interfaces/services/employee/emplAuth.services";
import { EmplAuthRepository } from "../../../repositories/entities/employeeRepositories/authRepository";
import { OtpRepository } from "../../../repositories/otpRepository";
import bcrypt from "bcrypt";

export class EmplAuthService implements IEmplAuthService {
  private emplRepo: IEmplAuthRepository;
  private cryptoService: ICryptoService;
  private jwtService: IJWTService;
  private emailService: IEmailService;
  private otpRepo: IOtpRepository;
  constructor(
    emplRepo: IEmplAuthRepository,
    otpRepo: IOtpRepository,
    emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    },
    jwtService: IJWTService,
    cryptoService: ICryptoService
  ) {
    this.emailService = new EmailService(emailConfig);
    this.emplRepo = emplRepo;
    this.cryptoService = cryptoService;
    this.jwtService = jwtService;
    this.otpRepo = otpRepo;
  }

  async registerEmployee(
    employee: IRegisterEmployee
  ): Promise<IRegisterEmployee | null> {
    try {
      const existingEmployee = await this.emplRepo.findEmplByEmail(
        employee.email
      );
      console.log(existingEmployee, "existingEmployee");
      if (existingEmployee) {
        const error = new Error("Employee already exists");
        error.name = "EmployeeAlreadyExists";
        throw error;
      }

      const hashedPassword = await this.cryptoService.hashData(
        employee.password
      );
      employee.password = hashedPassword;
      const newEmployee = await this.emplRepo.createEmployee(employee);

      const otp = this.cryptoService.generateOtp();
      console.log(otp, "otp..........!");
      const hashedOtp = await this.cryptoService.hashData(otp);
      await this.otpRepo.createOtp(String(newEmployee.email), hashedOtp);

      await this.emailService.sendOtpEmail(employee.email, otp);

      return newEmployee;
    } catch (error: unknown) {
      console.error("Error in registering Employee:", error);
      throw error;
    }
  }

  //verify OTP
  async verifyOtp(email: string, otp: string): Promise<any> {
    try {
      const otpRecord = await this.otpRepo.findOtp(email);
      if (!otpRecord) {
        const error = new Error("OTP not found or has expired");
        error.name = "OTPNotFoundOrHasExpired";
        throw error;
      }
      const verified = await this.cryptoService.compareData(otp, otpRecord.otp);
      console.log(verified, "verified");
      if (verified) {
        const updatedEmployee = await this.emplRepo.updateActivatedStatus(
          email,
          true
        );
        console.log(updatedEmployee, "updatedEmployee");
        await this.otpRepo.deleteOtp(email);
        return updatedEmployee;
      } else {
        const error = new Error("Invalid OTP");
        error.name = "InvalidOTP";
        throw error;
      }
    } catch (error: unknown) {
      throw error;
    }
  }

  async loginEmployee(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const employee = await this.emplRepo.findEmplByEmail(email);
      await this.emplRepo.updateActivatedStatus(email, true);
      if (!employee) {
        const error = new Error("Employee not found");
        error.name = "EmployeeNotFound";
        throw error;
      }

      if (!employee.isVerified) {
        const error = new Error(
          "Account not verified. Please verify your account"
        );
        error.name = "AcntNotVerified";
        throw error;
      }

      if (employee.isBlocked) {
        const error = new Error("Your account is blocked");
        error.name = "AccountIsBlocked";
        throw error;
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        employee.password as string
      );
      if (!isPasswordValid) {
        const error = new Error("Invalid password");
        error.name = "InvalidPassword";
        throw error;
      }
      const payload = { id: employee._id, role: "employee" };
      const accessToken = this.jwtService.generateAccessToken(payload);
      const refreshToken = this.jwtService.generateRefreshToken(payload);
      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const employee: IEmployee | null = await this.emplRepo.findEmplByEmail(
        email
      );
      if (!employee) {
        console.log("qwert");
        const error = new Error("Employee not found!");
        error.name = "EmployeeNotFound";
        throw error;
      }

      const token = this.jwtService.generateAccessToken({
        id: employee._id,
        role: "employee",
      });
      await this.emplRepo.savePasswordResetToken(employee._id, token);
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await this.emailService.sendPasswordResetEmail(email, resetLink);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = this.jwtService.verifyAccessToken(token);
      console.log(decoded, "decodeddddddd");

      if (!decoded.id) {
        const error = new Error("Invalid reset token");
        error.name = "InvalidResetToken";
        throw error;
      }

      const employee = await this.emplRepo.findEmplById(decoded.id);
      console.log(employee, "employee of employeeUseCase");
      if (!employee) {
        const error = new Error("Employee not found");
        error.name = "EmployeeNotFound";
        throw error;
      }

      const storedToken = await this.emplRepo.getPasswordResetToken(decoded.id);
      console.log(storedToken, "storedToken in EmployeeuseCse");
      if (!storedToken || storedToken !== token) {
        const error = new Error("Invalid or expired reset token");
        error.name = "InvalidOrExpiredResetToken";
        throw error;
      }

      const hashedPassword = await this.cryptoService.hashData(newPassword);
      console.log(hashedPassword, "hashedPassword in employeeUseCase");
      await this.emplRepo.updatePassword(decoded.id, hashedPassword);
      await this.emplRepo.clearPasswordResetToken(decoded.id);
    } catch (error) {
      throw error;
    }
  }

    async isAuthenticated(
      token: string | undefined
    ): Promise<IsAuthenticatedUseCaseRES> {
      try {
        if (!token) {
          return { message: "Unauthorized: No token provided", status: 401 };
        }
        const decoded = this.jwtService.verifyAccessToken(token) as JWTPayload;
        console.log(decoded, "23456789000987654");
        if (decoded.role?.toLowerCase() !== "employee") {
          return { message: "No access employee", status: 401 };
        }
        return { message: "Employee is Authenticated", status: 200 };
      } catch (error) {
        throw error;
      }
    }
}

const emplAuthRepository = new EmplAuthRepository();
const otpRepository: IOtpRepository = new OtpRepository();
const IjwtService: IJWTService = new JWTService();
const cryptoService: ICryptoService = new CryptoService();

const emailConfig = {
  user: process.env.EMAIL_COMPANY,
  pass: process.env.EMAIL_PASS,
  frontendUrl: process.env.FRONTEND_URL,
};

export const emplAuthServices = new EmplAuthService(
  emplAuthRepository,
  otpRepository,
  emailConfig,
  IjwtService,
  cryptoService
);
