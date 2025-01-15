import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { EmployeeUseCase } from "../usecase/employeeUseCase";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import { handleError, handleSuccess } from "../framework/utils/responseHandler";
import { IEmployeeController } from "../interfaces/IEmployee";
import { IJWTService } from "../interfaces/IJwt";

export class EmployeeController implements IEmployeeController {
  constructor(private employeeUseCase: EmployeeUseCase, private IJwtService:IJWTService) {}
  async registerEmployee(req: Request, res: Response):Promise<Response | void> {
    try {
      const { name, email, mobile, password } = req.body;
      console.log(name,email,mobile,password,"req.bosyyyy ")
      if (!name || !email || !mobile || !password) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(handleError("Allfields are required", 400));
        return;
      }
      const employee = await this.employeeUseCase.registerEmployee({
        name,
        email,
        mobile,
        password,
      });
      const response = handleSuccess("Employee registerd Successfully!", 201, employee);
      res.status(response.statusCode).json(response);
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "An unknown error occurred" });
      }
    }
  }

  async verifyOtp(req: Request, res: Response):Promise<Response | void> {
    try {
      const { email, otp } = req.body;
      console.log(email, otp, "req.body");
      const result = await this.employeeUseCase.verifyOtp(email,otp);
      console.log(result,"resulttMahn")
      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "An unknown error occurred" });
      }
    }
  }

  async employeeLogin(req: Request, res: Response):Promise<Response | void> {
    const { email, password } = req.body;
    console.log(email, password, "employeelogin");
    try {
      const employee = await this.employeeUseCase.findEmployeeByEmail(email);
      console.log(11, employee);
      if (!employee) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "Employee not found" });
      }
      if (!employee.isVerified) {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          message: "Account not verified. Please verify your account.",
          employeeId: employee._id,
        });
      }
      if (employee.isBlocked) {
        return res
          .status(HttpStatusCode.FORBIDDEN)
          .json({ message: "Your account is blocked" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        employee.password as string
      );
      if (!isPasswordValid) {
        return res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: "Invalid password" });
      }

      // Generate tokens
      const payload = { employeeId: employee._id };
      console.log("payload", payload);
      const accessToken = this.IJwtService.generateAccessToken(payload);
      console.log("accessToken", accessToken);
      const refreshToken = this.IJwtService.generateRefreshToken(payload);
      console.log("refreshToken", refreshToken);

      // Send tokens to the client
      return res
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 60 * 1000, // 30 minutes
        })
        .status(HttpStatusCode.OK)
        .json({ message: "Login success", accessToken, refreshToken });
    } catch (error) {
      console.error("Error during OTP resend", error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred during OTP resend" });
    }
  }

  async forgotPassword(req: Request, res: Response):Promise<Response | void> {
    const { email } = req.body;
    console.log(email, "emailgot itttt");
    try {
      await this.employeeUseCase.forgotPassword(email);
      return res
        .status(HttpStatusCode.OK)
        .json({ message: "Password reset link sent to your email" });
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: error.message });
      } else {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "An unknown error occurred" });
      }
    }
  }
  async resetPassword(req: Request, res: Response):Promise<Response | void> {
    const { password, token } = req.body;
    console.log(password,token,"req.bodyyy")
    try {
        // console.log(password, token,"password and token");
        await this.employeeUseCase.resetPassword(token, password);
        return res.status(HttpStatusCode.OK).json({ message: 'Password has been reset' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
      } else {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'An unknown error occurred' });
      }
    }
  }
}
