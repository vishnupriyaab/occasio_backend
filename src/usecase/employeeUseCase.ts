import { IEmployee, IRegisterEmployee } from "../entities/employee.entity";
import { EmployeeRepository } from "../repositories/employeeRepository";
import { OtpRepository } from "../repositories/otpRepository";
import { IEmployeeUseCase } from "../interfaces/IEmployee";
import { EmailService, IEmailService } from "../framework/utils/emailService";
import { ICryptoService } from "../interfaces/ICrypto";
import { CryptoService } from "../framework/utils/cryptoServices";
import { IJWTService } from "../interfaces/IJwt";
import { JWTService } from "../framework/utils/jwtServices";


export class EmployeeUseCase implements IEmployeeUseCase {
  private emailService: IEmailService;
  private cryptoService: ICryptoService;
  private jwtService: IJWTService;

  constructor(
    private employeeRepo: EmployeeRepository,
    private otpRepo: OtpRepository,
    emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    },
    jwtService: IJWTService
  ) {
    this.emailService = new EmailService(emailConfig);
    this.cryptoService = new CryptoService();
    this.jwtService = jwtService;
    // this.jwtService = new JWTService({
    //   secret: process.env.JWT_SECRET || "occasioEventManagement",
    //   expiresIn: "1h",
    // });
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
      // const hashedPassword = await hashPassword(employee.password);
      // employee.password = hashedPassword;
      // const newEmployee = await this.employeeRepo.createEmployee(employee);

      const hashedPassword = await this.cryptoService.hashData(
        employee.password
      );
      employee.password = hashedPassword;
      const newEmployee = await this.employeeRepo.createEmployee(employee);

      // const otp = crypto.randomInt(1000, 9999).toString();
      // console.log(otp, "OTP of createOTP");
      // const hashedOtp = await hashOtp(otp);
      // console.log(hashedOtp, "hashedOtp");
      // await this.otpRepo.createOtp(String(newEmployee.email), hashedOtp);
      // await this.sendOtpEmail(employee.email, otp);
      // console.log("Employee Registration successfull!!");
      // return newEmployee;
      const otp = this.cryptoService.generateOtp();
      console.log(otp, "otp..........!");
      // const hashedOtp = await hashOtp(otp);
      const hashedOtp = await this.cryptoService.hashData(otp);
      await this.otpRepo.createOtp(String(newEmployee.email), hashedOtp);

      await this.emailService.sendOtpEmail(employee.email, otp);

      return newEmployee;
    } catch (error) {
      console.error("Error in registering Employee:", error);
      throw error;
    }
  }
  // sendOtpEmail(email: string, otp: string) {
  //   let transporter = nodemailer.createTransport({
  //     service: "gmail",
  //     host: "smtp.gmail.com",
  //     port: 465,
  //     secure: true,
  //     auth: {
  //       user: process.env.EMAIL_COMPANY,
  //       pass: process.env.EMAIL_PASS,
  //     },
  //   });

  //   const mailOptions = {
  //     from: process.env.EMAIL_COMPANY,
  //     to: email,
  //     subject: "Verify Your Email - Occasio Event Management Team",
  //     html: `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
  //             <p>Hi <strong>Crew Member</strong>,</p>
  //             <p>Your OTP for registration is: <strong>${otp}</strong></p>
  //             <p>This OTP is valid for the next <strong>5 minutes</strong>. Please do not share this OTP with anyone for security reasons.</p>
  //             <p>If you did not request this OTP, please ignore this email.</p>
  //             <br />
  //             <p>Thank you,</p>
  //             <p><strong>Occasio Event Management Team.</strong></p>
  //           </div>`,
  //   };
  //   return transporter.sendMail(mailOptions);
  // }

  async verifyOtp(email: string, otp: string) {
    const otpRecord = await this.otpRepo.findOtp(email);
    console.log(otpRecord?.otp, otp, "otpRecordManhhh!!!!!");
    if (!otpRecord) {
      throw new Error("OTP not found or has expired");
    }
    // const verified = await compareOtp(otp, otpRecord.otp);
    const verified = await this.cryptoService.compareData(otp, otpRecord.otp);
    console.log(verified, "lalalalalalal");
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
  }
  async findEmployeeByEmail(email: string): Promise<IEmployee | null> {
    // console.log(this.employeeRepo.findEmployeeByEmail(email),"123456789123456789")
    return await this.employeeRepo.findEmployeeByEmail(email);
  }

  async forgotPassword(email: string): Promise<void> {
    const employee : IEmployee | null= await this.employeeRepo.findEmployeeByEmail(email);
    console.log("employee", employee);
    if (!employee) {
      console.log("qwert");
      throw new Error("Employee not found!");
    }

    const token = this.jwtService.generateAccessToken({ employeeId: employee._id, role:'employee' });
    console.log(employee._id,"employeeIdddddddddddd");
    console.log(token,"tokennnnnnnnnnnnnnnnnnn in employee")
    await this.employeeRepo.savePasswordResetToken(
      employee._id,
      token
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.emailService.sendPasswordResetEmail(email, resetLink);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // const decoded = jwt.verify(
      //   token,
      //   process.env.JWT_SECRET || "OccasioEventManagement"
      // ) as JWTPayload;
      // console.log(decoded, "decoded");
      // if (!decoded.employeeId) {
      //   throw new Error("Invalid reset token");
      // }
      const decoded = this.jwtService.verifyAccessToken(token);

      console.log(decoded,"decodeddddddd")

      if (!decoded.employeeId) {
        throw new Error("Invalid reset token");
      }

      // Get employee and verify token matches
      const employee = await this.employeeRepo.findEmployeeById(decoded.employeeId);
      console.log(employee, "employee of employeeUseCase");
      if (!employee) {
        throw new Error("Employee not found");
      }

      // Verify the stored reset token matches
      const storedToken = await this.employeeRepo.getPasswordResetToken(
        decoded.employeeId
      );
      console.log(storedToken, "storedToken in EmployeeuseCse");
      if (!storedToken || storedToken !== token) {
        throw new Error("Invalid or expired reset token");
      }

      // Hash the new password
      // const hashedPassword = await hashPassword(newPassword);

      const hashedPassword = await this.cryptoService.hashData(newPassword);
      console.log(hashedPassword, "hashedPassword in employeeUseCase");
      // Update password and clear reset token
      await this.employeeRepo.updatePassword(
        decoded.employeeId,
        hashedPassword
      );
      await this.employeeRepo.clearPasswordResetToken(decoded.employeeId);
    } catch (error) {
      // if (error instanceof jwt.JsonWebTokenError) {
      //   throw new Error("Invalid or expired reset token");
      // }
      throw error;
    }
  }
}
