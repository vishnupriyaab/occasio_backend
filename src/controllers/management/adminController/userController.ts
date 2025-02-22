import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import IUserService from "../../../interfaces/services/admin/user.services";
import { ErrorResponse, successResponse } from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { adminUserServices } from "../../../services/business/adminServices/userServices";

export class AdminUserController {
  private _userService: IUserService
  constructor(userService: IUserService) {
    this._userService = userService
  }

  //blockUser
  async blockUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      console.log(userId, "userId");

      const result = await this._userService.blockUser(userId);
      const response = result?.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully";

        console.log(result,"muneer", response,"Success");
      return successResponse(res, HttpStatusCode.OK, response, result);

    } catch (error: unknown) {
      console.log(error,"Errorrr")
      if (error instanceof Error) {
        if (error.name == "UserNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "UserNotFound");
          return;
        }
      }else{
        ErrorResponse(res, 500, 'Internal Server Error')
        return;
      }
    }
  }

  //searchUser
  async searchUser(req: Request, res: Response): Promise<void> {
    try {
      console.log("123456789`123456789")
      const searchTerm = (req.query.searchTerm as string | undefined) || "";
      const filterStatus = req.query.filterStatus as string | undefined;
      console.log(searchTerm,filterStatus, "qwertyuio");

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;

      const result = await this._userService.searchUser(
        searchTerm,
        filterStatus,
        page,
        limit
      );
        return successResponse(
        res,
        HttpStatusCode.OK,
        "Users fetched successfully",
        result
      );
    } catch (error: unknown) {
      console.log(error, "errorrrrrr");
      if (error instanceof Error) {
        if (error.name === "InvalidPageOrLimit") {
          ErrorResponse(res, 401, "InvalidPageOrLimit");
          return ;
        }
      }
      ErrorResponse(res, 500, 'Internal Server Error')
      return;
    }
  }
}

export const adminUserController = new AdminUserController(adminUserServices);
