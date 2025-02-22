import { Response } from "express";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import IEmplProfileService from "../../../interfaces/services/employee/profile.services";
// import IEmplProfileController from "../../../interfaces/controller/employee/profile.controller";
import { emplProfileServices } from "../../../services/business/employeeService/profileService";

export class EmplProfileController {
  private _profileService: IEmplProfileService;

  constructor(profileService: IEmplProfileService) {
    this._profileService = profileService;
  }

  //showProfile
  async showProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log(req.id, "Vishnu12345"); //editProfile
      const userId = req.id;
      if (!userId) {
        const error = new Error("User ID is required");
        error.name = "UserIDIsRequired";
        throw error;
      }

      const profile = await this._profileService.showProfile(userId);
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Profile fetched successfully",
        profile
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "UserIDIsRequired") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "User ID is required");
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

  //updateProfile
  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId: string = req.id || "";
      const { name, email, password, confirmPassword } = req.body;
      console.log(name, email, password, confirmPassword, "1111111111111");
      if (!name || !email || !password || !confirmPassword) {
        const error = new Error("All fields are required");
        error.name = "AllFieldsAreRequired";
        throw error;
      }

      if (password !== confirmPassword) {
        const error = new Error("Passwords do not match");
        error.name = "PasswordsDoNotMatch";
        throw error;
      }
      const updatedUser = await this._profileService.updateProfile(userId, {
        name,
        email,
        password,
      });

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Profile updated successfully",
        updatedUser
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
        if (error.name === "PasswordsDoNotMatch") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Passwords do not match"
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

  //updateProfileImg
  async updateProfileImage(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId: string = req.id!;
      const image = req.file?.path;

      if (!image) {
        const error = new Error("Image is required");
        error.name = "ImageIsRequired";
        throw error;
      }

      const updatedUser = await this._profileService.updateProfileImage(
        image,
        userId
      );
      successResponse(
        res,
        HttpStatusCode.OK,
        "Profile image upadted",
        updatedUser
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "ImageIsRequired") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Image is required");
          return;
        }
      }
    }
  }
}

export const emplProfileController = new EmplProfileController( emplProfileServices );
