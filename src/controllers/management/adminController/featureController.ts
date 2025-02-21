import { Request, Response } from "express";
import IAdminFeatureService from "../../../interfaces/services/admin/feature.services";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { adminFeatureService } from "../../../services/business/adminServices/featureService";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";

export class AdminFeatureController {
  private featureService: IAdminFeatureService;
  constructor(featureService: IAdminFeatureService) {
    this.featureService = featureService;
  }

  //addFaeture
  async addFeature(req: Request, res: Response): Promise<void> {
    try {
      const { packageId, name, amount } = req.body;
      console.log(packageId, name, amount, "Controller data");

      if (!packageId || !name || amount === undefined) {
        const error = new Error("All fields are required");
        error.name = "AllFieldsAreRequired";
        throw error;
      }
      const result = await this.featureService.addFeature(packageId, {
        name,
        amount,
      });

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Feature created successfully",
        result
      );
    } catch (error: unknown) {
      console.log("Error in addFeature controller:", error);
      if (error instanceof Error) {
        if (error.name === "AllFieldsAreRequired") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "All fields are required"
          );
          return;
        }
        if (error.name === "PackageNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Package not found");
          return;
        }
        if (error.name === "FeatureAlreadyExists") {
          ErrorResponse(
            res,
            HttpStatusCode.CONFLICT,
            "Feature with this name already exists in the package"
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

  //editFeature
  async updateFeature(req: Request, res: Response): Promise<void> {
    try {
      const featureId = req.params.id;
      const { packageId, name, amount } = req.body;
      console.log(featureId, packageId, name, amount, "Controller update data");

      if (!packageId || !featureId || !name || amount === undefined) {
        const error = new Error("All fields are required");
        error.name = "AllFieldsAreRequired";
        throw error;
      }

      const result = await this.featureService.updateFeature(
        packageId,
        featureId,
        { name, amount }
      );

      successResponse(
        res,
        HttpStatusCode.OK,
        "Feature updated successfully",
        result
      );
    } catch (error: unknown) {
      console.log("Error in updateFeature controller:", error);
      if (error instanceof Error) {
        if (error.name === "PackageNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Package not found");
          return;
        }
        if (error.name === "FeatureNotFound") {
          ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "Feature not found in package"
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

  //blockFeatures
  async blockFeature(req: Request, res: Response): Promise<void> {
    try {
      const packageId = req.params.packageId;
      const featureId: string = req.query.featureId as string;

      console.log(packageId, "packageId", featureId, "featureId");

      const result: any = await this.featureService.blockFeature(
        packageId,
        featureId
      );
      const response = result.isBlocked
        ? "Feature blocked successfully"
        : "Feature unblocked successfully";
      successResponse(res, HttpStatusCode.OK, response, result);
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "PackageIdRequired") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "PackageId is required");
          return;
        }
        if (error.name === "featureIdRequired") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "FeatureId is required");
          return;
        }
        if (error.name === "PackageNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Package not found");
          return;
        }
        if (error.name === "FeatureNotFound") {
          ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "Feature not found in the package"
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

  //deleteFeatures
  async deleteFeature(req: Request, res: Response): Promise<void> {
    try {
      const packageId = req.params.packageId;
      const featureId: string = req.query.featureId as string;
      console.log(packageId, featureId);

      await this.featureService.deleteFeature(packageId, featureId);
      successResponse(res, HttpStatusCode.OK, 'Feature deleted successfully');
      return;
    } catch (error: unknown) {
      if(error instanceof Error){
        if(error.name === 'PackageIdRequired'){
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, 'PackageId is required')
          return;
        }
        if(error.name === 'featureIdRequired'){
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, 'FeatureId is required')
          return;
        }
        if(error.name === 'PackageNotFound'){
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, 'Package not found')
          return;
        }
        if(error.name === 'FeatureNotFound'){
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, 'Feature not found in the package')
          return;
        }
      }
      ErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, 'Internal Server Error');
      return;
    }
  }

    //getFeatures
    async getPackageDetails(req: Request, res: Response): Promise<void> {
      try {
        const packageId: string = req.params.id;
        const searchTerm = (req.query.searchTerm as string | undefined) || "";
        const filterStatus = req.query.filterStatus as string | undefined;
  
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit
          ? parseInt(req.query.limit as string, 10)
          : 10;
       
  
        const result = await this.featureService.searchFeature(
          packageId,
          searchTerm,
          filterStatus,
          page,
          limit
        );

        return successResponse(
        res,
        HttpStatusCode.OK,
        "features fetched successfully",
        result
      );
      } catch (error: unknown) {
        
      }
    }

}

export const adminFeatureController = new AdminFeatureController(
  adminFeatureService
);
