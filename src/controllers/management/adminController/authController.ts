import { Request, Response } from "express";
import IAdminServices from "../../../interfaces/services/admin/admin.services";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { adminAuthServices } from "../../../services/business/adminServices/authService";
import IAdminAuthController from "../../../interfaces/controller/admin/admin.controller";

export class AdminAuthController implements IAdminAuthController {
  private adminService: IAdminServices
  constructor( adminService: IAdminServices) {
    this.adminService = adminService;
  }

  //adminLogin
  async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      const { accessToken, refreshToken } = await this.adminService.adminLogin(
        email,
        password
      );
      console.log(accessToken, refreshToken, "123");
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
        "Admin logged in successfully"
      );
    } catch (error: unknown) {
      console.log(error, "errorrr during the admin controller");

      if (error instanceof Error) {
        if (error.name === "AdminNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "AdminNotFound");
          return;
        }
        if (error.name === "InvalidCredentials") {
          ErrorResponse(res, HttpStatusCode.UNAUTHORIZED, "InvalidCredentials");
          return;
        }
      }
    }
  }

  //isAuthenticated
  async isAuthenticated(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.cookies, "qwertyu");
      const token = req.cookies.access_token;
      console.log(token, "authenticatedToken");
      const responseObj = await this.adminService.isAuthenticated(token);
      console.log(responseObj, "qwertyuiopertyuiop");

      return successResponse(res, HttpStatusCode.OK, "Admin is Authenticated");
    } catch (error: unknown) {
      console.log(error);
    }
  }

  //logOut
  async logOut(req: AuthenticatedRequest, res: Response): Promise<void> {
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
      return successResponse(res, HttpStatusCode.OK, "Logout successful");

    } catch (error: unknown) {
        console.error(error, "Error during logout");
        return ErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "Logout failed. Please try again.",
        );
    }
  }
}


export const adminAuthController = new AdminAuthController(adminAuthServices);