import { Request, Response } from "express";
import IAdminPackageController from "../../../interfaces/controller/admin/package.controller";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import IAdminPackageService from "../../../interfaces/services/admin/package.services";
import { adminPackageService } from "../../../services/business/adminServices/packageService";

export class AdminPackageController implements IAdminPackageController {
  private packageService: IAdminPackageService;
  constructor(packageService: IAdminPackageService) {
    this.packageService = packageService;
  }

  //addPackage
  async addPackage(req: Request, res: Response): Promise<void> {
    try {
      const { packageName, startingAmnt, eventId } = req.body;
      const items = JSON.parse(req.body.items);
      const file = req.file;

      if (!file) {
        const error = new Error("No image file provided");
        error.name = "NoImageFile";
        throw error;
      }
      const newPackage = await this.packageService.addPackage(
        { packageName, startingAmnt, eventId, items },
        file
      );

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Package successfully created",
        newPackage
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "NoImageFile") {
          ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "No image file provided"
          );
          return;
        }
        if (error.name === "PackageAlreadyExists") {
          ErrorResponse(res, HttpStatusCode.CONFLICT, "Package already exists");
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

  //getPackage
  async getPackages(req: Request, res: Response): Promise<void> {
    const eventId: string = req.params.id;
    try {
      console.log(eventId, "eventId");
      const packages = await this.packageService.getAllPackages(eventId);

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Package fetched successfully",
        packages
      );
    } catch (error: unknown) {
      console.log(error, "qwertyuiop");
      ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
      return;
    }
  }

  //updatePackage
  async updatePackage(req: Request, res: Response): Promise<void> {
    try {
      const packageId = req.params.id;
      console.log(packageId, "packageId");
      const { packageName, startingAmnt, eventId } = req.body;
      console.log(packageName, startingAmnt, eventId, "req.bodyyyyyy");
      const file = req.file;
      const updatedData: any = { packageName, startingAmnt, eventId };
      // if (file) {
      //   const imageUrl = await this.cloudinaryService.uploadImage(file);
      //   updatedData.image = imageUrl;
      // }
      if (!file) {
        const error = new Error("Image is required");
        error.name = "ImageIsRequired";
        throw error;
      }
      const updatedPackage = await this.packageService.updatedPackage(
        packageId,
        updatedData,
        file
      );

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Package successfully updated",
        updatedPackage
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "ImageIsRequired") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Image is required");
          return;
        }
        if (error.name === "PackageNotFound") {
          ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "Package not found for this event"
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

  //deletePackage
  async deletePackage(req: Request, res: Response): Promise<void> {
    try {
      const packageId = req.params.id;
      console.log(packageId, "packageId");
      await this.packageService.deletePackage(packageId);

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Package successfully deleted"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "PackageNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Package not found");
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

    //blockPackage
    async blockPackage(req: Request, res: Response): Promise<void> {
      try {
        const packageId = req.params.id;
        console.log(packageId, "packageIddddddddddd");
        const result: any = await this.packageService.blockPackage(packageId);

        const response = result.isBlocked
        ? "Package blocked successfully"
        : "Package unblocked successfully";
        
        return successResponse(res, HttpStatusCode.OK, response, result)

    } catch (error: unknown) {
        
      }
    }
}

export const adminPackageController = new AdminPackageController(
  adminPackageService
);
