import { Request, Response } from "express";
import IAdminEmployeeService from "../../../interfaces/services/admin/employee.services";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { adminEmployeeServices } from "../../../services/business/adminServices/employeeService";

export class AdminEmployeeController {
  private _employeeService: IAdminEmployeeService;
  constructor(employeeService: IAdminEmployeeService) {
    this._employeeService = employeeService;
  }

  //blockEmployee
  async blockEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = req.params.id;
      console.log(employeeId, "employeeId");
      const result = await this._employeeService.blockEmployee(employeeId);
      const response = result?.isBlocked
        ? "Employee blocked successfully"
        : "Employee unblocked successfully";

      return successResponse(res, HttpStatusCode.OK, response, result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name == "EmployeeNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "EmployeeNotFound");
          return;
        } else {
          ErrorResponse(res, 500, "Internal Server Error");
          return;
        }
      }
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

      const data = await this._employeeService.searchEmployee(
        searchTerm,
        filterStatus,
        page,
        limit
      );
      console.log(data, "123456789");
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Emplyees fetched successfully",
        data
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "InvalidPageOrLimit") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Invalid page or limit");
          return;
        }
      }
      ErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, "Internal Server Error");
      return;
    }
  }
}

export const adminEmployeeController = new AdminEmployeeController(
  adminEmployeeServices
);
