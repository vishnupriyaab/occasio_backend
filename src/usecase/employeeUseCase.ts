import { IEmployee, IRegisterEmployee } from "../entities/employee.entity";
import { EmailService } from "../integration/emailService";
import { ICryptoService } from "../interfaces/integration/ICrypto";
import { IJWTService, JWTPayload } from "../interfaces/integration/IJwt";
import bcrypt from "bcrypt";
import { IEmailService } from "../interfaces/integration/IEmail";
import { IEmployeeUseCase } from "../interfaces/useCase/employee.useCase";
import IEmployeeRepository from "../interfaces/repository/employee.Repository";
import IOtpRepository from "../interfaces/repository/otp.Repository";
import { IsAuthenticatedUseCaseRES } from "../interfaces/common/IIsAuthenticated";
import { IProfile } from "../entities/user.entity";

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

  async verifyOtp(email: string, otp: string): Promise<any> {
    try {
      const otpRecord = await this.otpRepo.findOtp(email);
      if (!otpRecord) {
        throw new Error("OTP not found or has expired");
      }
      const verified = await this.cryptoService.compareData(otp, otpRecord.otp);
      console.log(verified, "verified");
      if (verified) {
        const updatedEmployee = await this.employeeRepo.updateActivatedStatus(
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
      const employee = await this.employeeRepo.findByEmail(email);
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
      const employee: IEmployee | null = await this.employeeRepo.findByEmail(
        email
      );
      console.log("employee", employee);
      if (!employee) {
        console.log("qwert");
        throw new Error("Employee not found!");
      }

      const token = this.jwtService.generateAccessToken({
        id: employee._id,
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

      if (!decoded.id) {
        throw new Error("Invalid reset token");
      }

      const employee = await this.employeeRepo.findEmployeeById(
        decoded.id
      );
      console.log(employee, "employee of employeeUseCase");
      if (!employee) {
        throw new Error("Employee not found");
      }

      const storedToken = await this.employeeRepo.getPasswordResetToken(
        decoded.id
      );
      console.log(storedToken, "storedToken in EmployeeuseCse");
      if (!storedToken || storedToken !== token) {
        throw new Error("Invalid or expired reset token");
      }

      const hashedPassword = await this.cryptoService.hashData(newPassword);
      console.log(hashedPassword, "hashedPassword in employeeUseCase");
      await this.employeeRepo.updatePassword(
        decoded.id,
        hashedPassword
      );
      await this.employeeRepo.clearPasswordResetToken(decoded.id);
    } catch (error) {
      throw error;
    }
  }

    async showProfile(userId: string): Promise<IProfile> {
      try {
        const user = await this.employeeRepo.findEmployeeById(userId);
        // console.log(user,'qwertyuio');
        if (!user) {
          throw new Error('User not found');
        }
        const userProfile = {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          imageUrl: user.imageUrl,
          isVerified: user.isVerified,
          isActivated: user.isActivated,
          createdAt: user.createdAt,
        };
        return userProfile;
      } catch (error) {
        throw error;
      }
    }

      async updateProfile(userId: string, updateData: Partial<IEmployee>): Promise<IEmployee | null> {
        try {
            const { name, email, password } = updateData;
    
            if (email) {
                const existingUser = await this.employeeRepo.findByEmail(email);
                if (existingUser && existingUser._id.toString() !== userId) {
                    throw new Error("Email already in use by another user");
                }
            }
            if (password) {
                const hashedPassword = await this.cryptoService.hashData(password);
                updateData.password = hashedPassword;
            }
    
            const updatedUser = await this.employeeRepo.updateUserProfile(userId, updateData);
            if (!updatedUser) {
                throw new Error("User not found or update failed");
            }
    
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

      async updateProfileImage(image:string, userId: string):Promise<IEmployee | null>{
        try {
        console.log(image,"qwqwqwqwqw")
        const updatedUser = await this.employeeRepo.updateUserProfileImage(userId, image);
        console.log(updatedUser,".,mnpokj")
        if (!updatedUser) {
          throw new Error('User not found or update failed');
        }
        return updatedUser;
        } catch (error) {
          console.error('Error in updateProfileImage:', error);
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
