import { Request, Response } from "express";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import { handleError, handleSuccess } from "../framework/utils/responseHandler";
import { ResponseMessage } from "../constant/responseMsg";
import IAdminUseCase from "../interfaces/useCase/admin.useCase";
import { AuthenticatedRequest } from "../framework/middlewares/authenticateToken";

export class AdminController  {
  constructor(private adminUseCase: IAdminUseCase) {}









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
