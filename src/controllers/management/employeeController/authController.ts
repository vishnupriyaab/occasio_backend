import { Request, Response } from "express";
import IEmplAuthController from "../../../interfaces/controller/employee/auth.controller";
import IEmplAuthService from "../../../interfaces/services/employee/emplAuth.services";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { emplAuthServices } from "../../../services/business/employeeService/authService";

export class EmplAuthController implements IEmplAuthController {
  private emplService: IEmplAuthService;
  constructor(emplService: IEmplAuthService) {
    this.emplService = emplService;
  }

  //Employee - register
  async registerEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, mobile, password } = req.body;
      console.log(name, email, mobile, password, "req.bodyyyy ");
      if (!name || !email || !mobile || !password) {
        const error = new Error("All fields are required");
        error.name = "AllFieldsAreRequired";
        throw error;
      }

      const employee = await this.emplService.registerEmployee({
        name,
        email,
        mobile,
        password,
      });

      return successResponse(
        res,
        HttpStatusCode.CREATED,
        "Employee registered successfully!",
        employee
      );
    } catch (error: unknown) {
      console.error("Employee register error:", error);
      if (error instanceof Error) {
        if (error.name === "AllFieldsAreRequired") {
          ErrorResponse(
            res,
            HttpStatusCode.UNPROCESSABLE_ENTITY,
            "All fields are required"
          );
          return;
        }
        if (error.name === "EmployeeAlreadyExists") {
          ErrorResponse(
            res,
            HttpStatusCode.CONFLICT,
            "Employee already exists"
          );
          return;
        }
      }
      ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server error"
      );
      return;
    }
  }

  //Verify - OTP
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      console.log(email, otp, "req.body");
      const result = await this.emplService.verifyOtp(email, otp);

      return successResponse(
        res,
        HttpStatusCode.OK,
        "OTP successfully verified",
        result
      );
    } catch (error: unknown) {
      console.log("verifyOtp error: ", error);
      if (error instanceof Error) {
        if (error.name === "OTPNotFoundOrHasExpired") {
          ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "OTP not found or hasExpired"
          );
          return;
        }
        if (error.name === "InvalidOTP") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Invalid OTP");
          return;
        }
      }
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }

  //login
  async employeeLogin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    console.log(email, password, "employeelogin");
    try {
      const { accessToken, refreshToken } =
        await this.emplService.loginEmployee(email, password);
      res
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Employee logged in successfully"
      );
    } catch (error: unknown) {
      console.error("Error during OTP resend", error);
      if (error instanceof Error) {
        if (error.name === "EmployeeNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Employee not found");
          return;
        }
        if (error.name === "AcntNotVerified") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Account not verified. Please verify your account"
          );
          return;
        }
        if (error.name === "AccountIsBlocked") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Your account is blocked"
          );
          return;
        }
      }
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }

  //forgotPassword
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      console.log(email, "emailgot itttt");
      const result = await this.emplService.forgotPassword(email);
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Password reset link sent to your email",
        result
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "EmployeeNotFound") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Employee not found");
          return;
        }
      }
      ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
      return;
    }
  }

  //resetPassword
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { password, token } = req.body;
      console.log(password, token, "req.bodyyy");
      const result = await this.emplService.resetPassword(token, password);
      return successResponse(res, HttpStatusCode.OK, "Password has been reset");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "InvalidResetToken") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Invalid reset token");
          return;
        }
        if (error.name === "EmployeeNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Employee not found");
          return;
        }
        if (error.name === "InvalidOrExpiredResetToken") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Invalid or expired reset token"
          );
          return;
        }
      }
      ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
      return;
    }
  }

  //logOut
  async logOut(req: Request, res: Response): Promise<void> {
    try {
      res
        .clearCookie("refresh_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .clearCookie("access_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      console.log(123);
      successResponse(res, HttpStatusCode.OK, "Logout successful");
    } catch (error: unknown) {
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }

  //isAuthenticated
  async isAuthenticated(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.cookies, "qwertyu");
      const token = req.cookies.access_token;
      console.log(token, "authenticatedToken");
      const responseObj = await this.emplService.isAuthenticated(token);
      successResponse(res, responseObj.status, responseObj.message);
      // res
      //   .status(responseObj.status)
      //   .json(handleSuccess(responseObj.message, responseObj.status));
    } catch (error: unknown) {
      ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to authenticate"
      );
    }
  }
}

export const emplAuthController = new EmplAuthController(emplAuthServices);
