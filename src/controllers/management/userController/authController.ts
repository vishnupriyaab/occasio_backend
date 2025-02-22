import { Request, Response } from "express";
import IUserAuthService from "../../../interfaces/services/user/auth.services";
import { userAuthService } from "../../../services/business/userServices/authService";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";

export class UserAuthController {
  private _authService: IUserAuthService;
  constructor(authService: IUserAuthService) {
    this._authService = authService;
  }
  //user-register
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, mobile, password } = req.body;
      if (!name || !email || !mobile || !password) {
        const error = new Error("All fields are required");
        error.name = "AllFieldsAreRequired";
        throw error;
      }
      const user = await this._authService.registerUser({
        name,
        email,
        mobile,
        password,
      });
      return successResponse(
        res,
        HttpStatusCode.OK,
        "User registered successfully!",
        user
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AllFieldsAreRequired") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "All fields are required"
          );
          return;
        }
        if (error.name === "UserAlreadyExists") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "User already exists");
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

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      console.log(email, otp, "req.body");
      const result = await this._authService.verifyOtp(email, otp);
      return successResponse(
        res,
        HttpStatusCode.OK,
        "OTP verified successfully",
        result
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "OTPNotFoundOrHasExpired") {
          ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "OTP not found or has expired"
          );
          return;
        }
        if (error.name === "InvalidOTP") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Invalid OTP");
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

  //resendOtp
  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        const error = new Error("Email is required");
        error.name = "EmailIsRequired";
        throw error;
      }

      const result = await this._authService.resendOtp(email);
      return successResponse(
        res,
        HttpStatusCode.OK,
        "OTP resent successfully",
        result
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "EmailIsRequired") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Email is required");
          return;
        }
        if (error.name === "UserNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "User not found");
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

  //User-Login
  async userLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      const { accessToken, refreshToken } = await this._authService.loginUser(
        email,
        password
      );
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
        "User logged in successfully",
        { accessToken, refreshToken }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "UserNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "User not found");
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
        if (error.name === "InvalidPassword") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Invalid password");
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
    const { email } = req.body;
    console.log(email, "emailgot itttt");
    try {
      const result = await this._authService.forgotPassword(email);
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Password reset link sent to your email",
        result
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "UserNotFound") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "User not found");
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
      await this._authService.resetPassword(token, password);
      return successResponse(res, HttpStatusCode.OK, "Password has been reset");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "InvalidResetToken") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Invalid reset token");
          return;
        }
        if (error.name === "UserNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "User not found");
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

  //googleLogin
  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { credential } = req.body;
      const jwtToken = credential.credential;

      if (!jwtToken) {
        const error = new Error("Google credential is required");
        error.name = "GoogleCredentialIsRequired";
        throw error;
      }

      const { accessToken, refreshToken } = await this._authService.googleLogin(
        jwtToken
      );

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
        "User logged in successfully",
        { accessToken, refreshToken }
      );
    } catch (error: unknown) {
      if(error instanceof Error){
        if(error.name === 'GoogleCredentialIsRequired'){
            ErrorResponse(res, HttpStatusCode.BAD_REQUEST, 'Google credential is required')
            return;
        }
        if(error.name === 'InvalidToken'){
            ErrorResponse(res, HttpStatusCode.UNAUTHORIZED, 'Invalid token');
            return;
        }
        if(error.name === 'UserIsBlocked'){
            ErrorResponse(res, HttpStatusCode.FORBIDDEN, 'User is blocked. Please contact support');
            return;
        }
      }
    }
  }

  //logout
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
      return successResponse(res, HttpStatusCode.OK, "Logout successful");
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
      console.log(req.cookies, "1234567890-");
      const token = req.cookies.access_token;
      console.log(token, "authenticatedToken");
      const responseObj = await this._authService.isAuthenticated(token);
      return successResponse(res, responseObj.status, responseObj.message);
      //   res
      //     .status(responseObj.status)
      //     .json(handleSuccess(responseObj.message, responseObj.status));
    } catch (error: unknown) {
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to authenticate"
      );
    }
  }
}

export const userAuthController = new UserAuthController(userAuthService);
