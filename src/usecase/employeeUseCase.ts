import { IEmployee, IRegisterEmployee } from "../entities/employee.entity";
import { IEmployeeRepository, IEmployeeUseCase } from "../interfaces/IEmployee";
import { EmailService } from "../framework/utils/emailService";
import { ICryptoService } from "../interfaces/utils/ICrypto";
import { IJWTService } from "../interfaces/utils/IJwt";
import { IOtpRepository } from "../interfaces/IOtp";
import bcrypt from "bcrypt";
import { IEmailService } from "../interfaces/utils/IEmail";

export class EmployeeUseCase implements IEmployeeUseCase {
  private emailService: IEmailService;
  private cryptoService: ICryptoService;
  private jwtService: IJWTService;

  constructor(
    private employeeRepo: IEmployeeRepository,
    private otpRepo: IOtpRepository,
    emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    },
    jwtService: IJWTService,
    cryptoService: ICryptoService
  ) {
    this.emailService = new EmailService(emailConfig);
    this.cryptoService = cryptoService;
    this.jwtService = jwtService;
  }
  async registerEmployee(
    employee: IRegisterEmployee
  ): Promise<IRegisterEmployee | null> {
    try {
      const existingEmployee = await this.employeeRepo.findByEmail(
        employee.email
      );
      console.log(existingEmployee, "existingEmployee");
      if (existingEmployee) {
        throw new Error("Employee already exists");
      }

      const hashedPassword = await this.cryptoService.hashData(
        employee.password
      );
      employee.password = hashedPassword;
      const newEmployee = await this.employeeRepo.createEmployee(employee);

      const otp = this.cryptoService.generateOtp();
      console.log(otp, "otp..........!");
      const hashedOtp = await this.cryptoService.hashData(otp);
      await this.otpRepo.createOtp(String(newEmployee.email), hashedOtp);

      await this.emailService.sendOtpEmail(employee.email, otp);

      return newEmployee;
    } catch (error) {
      console.error("Error in registering Employee:", error);
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string):Promise<any> {
    try {
      const otpRecord = await this.otpRepo.findOtp(email);
      if (!otpRecord) {
        throw new Error("OTP not found or has expired");
      }
      const verified = await this.cryptoService.compareData(otp, otpRecord.otp);
      console.log(verified, "verified");
      if (verified) {
        const updatedEmployee = await this.employeeRepo.updateEmployeeStatus(
          email,
          true
        );
        console.log(updatedEmployee, "updatedEmployee");
        await this.otpRepo.deleteOtp(email);
        return {
          success: true,
          message: "OTP verified successfully",
          employee: updatedEmployee,
        };
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      throw error;
    }
  }

  async loginEmployee(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const employee = await this.employeeRepo.findEmployeeByEmail(email);
      await this.employeeRepo.updateActivatedStatus(email, true);
      if (!employee) {
        throw new Error("Employee not found");
      }

      if (!employee.isVerified) {
        throw new Error("Account not verified. Please verify your account.");
      }

      if (employee.isBlocked) {
        throw new Error("Your account is blocked");
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        employee.password as string
      );
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }
      const payload = { employeeId: employee._id, role: "employee" };
      const accessToken = this.jwtService.generateAccessToken(payload);
      const refreshToken = this.jwtService.generateRefreshToken(payload);
      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const employee: IEmployee | null =
        await this.employeeRepo.findEmployeeByEmail(email);
      console.log("employee", employee);
      if (!employee) {
        console.log("qwert");
        throw new Error("Employee not found!");
      }

      const token = this.jwtService.generateAccessToken({
        employeeId: employee._id,
        role: "employee",
      });
      console.log(employee._id, "employeeIdddddddddddd");
      console.log(token, "token in employee");
      await this.employeeRepo.savePasswordResetToken(employee._id, token);
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

      if (!decoded.employeeId) {
        throw new Error("Invalid reset token");
      }

      const employee = await this.employeeRepo.findEmployeeById(
        decoded.employeeId
      );
      console.log(employee, "employee of employeeUseCase");
      if (!employee) {
        throw new Error("Employee not found");
      }

      const storedToken = await this.employeeRepo.getPasswordResetToken(
        decoded.employeeId
      );
      console.log(storedToken, "storedToken in EmployeeuseCse");
      if (!storedToken || storedToken !== token) {
        throw new Error("Invalid or expired reset token");
      }

      const hashedPassword = await this.cryptoService.hashData(newPassword);
      console.log(hashedPassword, "hashedPassword in employeeUseCase");
      await this.employeeRepo.updatePassword(
        decoded.employeeId,
        hashedPassword
      );
      await this.employeeRepo.clearPasswordResetToken(decoded.employeeId);
    } catch (error) {
      throw error;
    }
  }
}
