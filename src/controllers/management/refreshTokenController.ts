import { Request, Response } from "express";
import IRefreshTokenService from "../../interfaces/services/refresh.services";
import {
  ErrorResponse,
  successResponse,
} from "../../integration/responseHandler";
import { HttpStatusCode } from "../../constant/httpStatusCodes";
import { refreshTokenServices } from "../../services/business/refreshTokenServices";

export class RefreshTokenController {
  private _refreshSevice: IRefreshTokenService;
  constructor(refreshSevice: IRefreshTokenService) {
    this._refreshSevice = refreshSevice;
  }
  async getNewAccessTokenWithRefreshToken(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refresh_token;
      console.log(refreshToken, "refreshToken");

      const accessToken =
        await this._refreshSevice.getNewAccessTokenWithRefreshToken(
          refreshToken
        );

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return successResponse(
        res,
        HttpStatusCode.OK,
        "OTP verified successfully",
        accessToken
      );
    } catch (error: unknown) {
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server error"
      );
    }
  }
}



export const refreshTokenController = new RefreshTokenController(refreshTokenServices);
