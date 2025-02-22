import { Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import IUserProfServices from "../../../interfaces/services/user/profile.services";
import { ErrorResponse, successResponse } from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { userProfileServices } from "../../../services/business/userServices/profileService";

export class UserProfController {
    private _userService: IUserProfServices
  constructor( userService: IUserProfServices ) {
    this._userService = userService;
  }

  async showProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log(req.id, "Vishnu12345"); //editProfile
      const userId = req.id;
      if (!userId) {
        const error = new Error('User ID is required')
        error.name = 'UserIdIsRequired'
        throw error;
      }

      const profile = await this._userService.showProfile(userId);
      return successResponse(res, HttpStatusCode.OK, 'Profile fetched successfully', profile);
    } catch (error: unknown) {
      if(error instanceof Error){
        if(error.name === 'UserIdIsRequired'){
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, 'User ID is required')
          return
        }
        if(error.name === 'UserNotFound'){
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, 'User not found')
          return
        }
      }
      ErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, 'Internal Server Error')
      return;
    }
  }

  async updateProfileImage(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId: string = req.id!;
      const image = req.file?.path;

      if (!image) {
        const error = new Error('Image is required');
        error.name = 'ImageIsRequired'
        throw error;
      }
      const updatedUser = await this._userService.updateProfileImage(
        image,
        userId
      );
      return successResponse(res, HttpStatusCode.OK, 'Profile image upadted', updatedUser)
    } catch (error:unknown) {
      if(error instanceof Error){
        if(error.name === 'ImageIsRequired'){
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, 'Image is required')
          return
        }
        if(error.name === 'UserNotFound'){
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, 'User not found or update failed')
          return
        }
      }
      ErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, 'Internal Server Error')
      return;
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId: string = req.id || "";
      const { name, email, password, confirmPassword } = req.body;

      if (!name || !email || !password || !confirmPassword) {
        const error = new Error('All fields are required');
        error.name = 'AllFieldsAreRequired'
        throw error;
      }

      if (password !== confirmPassword) {
        const error = new Error('Passwords do not match');
        error.name = 'PasswordsDonotMatch'
        throw error;
      }
      const updatedUser = await this._userService.updateProfile(userId, {
        name,
        email,
        password,
      });
      return successResponse(res, HttpStatusCode.OK, 'Profile updated successfully', updatedUser)
    } catch (error: unknown) {
      if(error instanceof Error){
        if(error.name === 'AllFieldsAreRequired'){
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, 'All fields are required')
          return
        }
        if(error.name === 'PasswordsDonotMatch'){
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, 'Passwords do not match')
          return
        }
        if(error.name === 'EmailAlreadyUse'){
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, 'Email already in use by another user')
          return
        }
        if(error.name === 'UserNotFound'){
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, 'User not found')
          return
        }
      }
      ErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, 'Internal Server Error')
      return;
    }
  }
}

export const userProfController = new UserProfController(userProfileServices);

