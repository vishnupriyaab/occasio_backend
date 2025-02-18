import { Request, Response } from "express";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import { handleError, handleSuccess } from "../framework/utils/responseHandler";
import { ResponseMessage } from "../constant/responseMsg";
import IAdminController from "../interfaces/controller/admin.controller";
import IAdminUseCase from "../interfaces/useCase/admin.useCase";
import { AuthenticatedRequest } from "../framework/middlewares/authenticateToken";

export class AdminController implements IAdminController {
  constructor(private adminUseCase: IAdminUseCase) {}

  //adminLogin
  async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      const { accessToken, refreshToken } = await this.adminUseCase.adminLogin(
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
        })
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(ResponseMessage.LOGIN_SUCCESS, HttpStatusCode.OK, {
            accessToken,
            refreshToken,
          })
        );
      return;
    } catch (error) {
      console.error("Admin login error:", error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.LOGIN_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  //blockUser
  async blockUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      console.log(userId, "qwertyu");

      const result: any = await this.adminUseCase.blockUser(userId);
      const response = result.isBlocked
        ? ResponseMessage.USER_BLOCKED
        : ResponseMessage.USER_UNBLOCKED;
      res
        .status(HttpStatusCode.OK)
        .json(handleSuccess(response, HttpStatusCode.OK, result));
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.BLOCK_USER_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
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
      res
        .status(HttpStatusCode.OK)
        .json(handleSuccess(ResponseMessage.LOGOUT_SUCCESS, HttpStatusCode.OK));
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.LOGOUT_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  //isAuthenticated
  async isAuthenticated(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.cookies, "qwertyu");
      const token = req.cookies.access_token;
      console.log(token, "authenticatedToken");
      const responseObj = await this.adminUseCase.isAuthenticated(token);
      res
        .status(responseObj.status)
        .json(handleSuccess(responseObj.message, responseObj.status));
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.AUTHENTICATION_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  //searchAndFilter
  async searchEmployee(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.query.searchTerm, "qwertyuio");
      const searchTerm = (req.query.searchTerm as string | undefined) || "";
      const filterStatus = req.query.filterStatus as string | undefined;

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;

      if (isNaN(page) || isNaN(limit)) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(
            handleError(
              "Invalid page or limit parameters",
              HttpStatusCode.BAD_REQUEST
            )
          );
        return;
      }

      const result = await this.adminUseCase.searchEmployee(
        searchTerm,
        filterStatus,
        page,
        limit
      );
      console.log(result, "123456789");
      res
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(ResponseMessage.FETCH_EVENT, HttpStatusCode.OK, result)
        );
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.FETCH_EMPLOYEE_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }
  async blockEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = req.params.id;
      console.log(employeeId, "dxfcgvbhjk");
      const result: any = await this.adminUseCase.blockEmployee(employeeId);
      const response = result.isBlocked
        ? ResponseMessage.EMPLOYEE_BLOCKED
        : ResponseMessage.EMPLOYEE_UNBLOCKED;
      res
        .status(HttpStatusCode.OK)
        .json(handleSuccess(response, HttpStatusCode.OK, result));
    } catch (error) {}
  }

  async searchUser(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.query.searchTerm, "qwertyuio");
      const searchTerm = (req.query.searchTerm as string | undefined) || "";
      const filterStatus = req.query.filterStatus as string | undefined;

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;

      if (isNaN(page) || isNaN(limit)) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(
            handleError(
              "Invalid page or limit parameters",
              HttpStatusCode.BAD_REQUEST
            )
          );
        return;
      }

      const result = await this.adminUseCase.searchUser(
        searchTerm,
        filterStatus,
        page,
        limit
      );
      console.log(result, "123456789");
      res
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(ResponseMessage.FETCH_EVENT, HttpStatusCode.OK, result)
        );
    } catch (error) {
      console.log(error, "errorrrrrr");
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.FETCH_EVENT_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

}
