import { Request, Response } from "express";
import { IRefreshTokenController } from "../interfaces/controller/refreshToken.controller";
import IRefreshTokenUseCase from "../interfaces/useCase/refreshToken.useCase";
import { ResponseMessage } from "../constant/responseMsg";
import { handleError, handleSuccess } from "../integration/responseHandler";
import { HttpStatusCode } from "../constant/httpStatusCodes";

export class RefreshTokenController implements IRefreshTokenController {
  constructor(private refreshUseCase: IRefreshTokenUseCase) {}

  async getNewAccessTokenWithRefreshToken(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refresh_token;
      console.log(refreshToken, "refreshToken");

      const accessToken =
        await this.refreshUseCase.getNewAccessTokenWithRefreshToken(
          refreshToken
        );

      res
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(
            ResponseMessage.OTP_VERIFIED,
            HttpStatusCode.OK,
            accessToken
          )
        );
    } catch (error: any) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            error.message,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }
}
