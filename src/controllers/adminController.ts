import { Request, Response } from "express";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import { IAdminController, IAdminUseCase } from "../interfaces/IAdmin";
import { handleError, handleSuccess } from "../framework/utils/responseHandler";
import { ResponseMessage } from "../constant/responseMsg";

export class AdminController implements IAdminController {
  constructor( private adminUseCase: IAdminUseCase ) {}

  //adminLogin
  async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      const { accessToken , refreshToken } = await this.adminUseCase.adminLogin(
        email,
        password
      );
      console.log(accessToken,refreshToken,"123")
      res
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 60 * 1000, // 30 minutes
        })
        .status( HttpStatusCode.OK ).json(handleSuccess( ResponseMessage.LOGIN_SUCCESS, HttpStatusCode.OK, { accessToken, refreshToken }) )
        return;
    } catch (error) {
      console.error("Admin login error:", error);
      res.status( HttpStatusCode.INTERNAL_SERVER_ERROR ).json( handleError( ResponseMessage.LOGIN_FAILURE, HttpStatusCode.INTERNAL_SERVER_ERROR ));
    }
  }

  //blockUser
  async blockUsers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      console.log(userId, "qwertyu");

      const result: any = await this.adminUseCase.blockUser(userId);

    if (result.isBlocked) {
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
      console.log("Cookies cleared for blocked user");
    }

      const response = result.isBlocked? ResponseMessage.USER_BLOCKED : ResponseMessage.USER_UNBLOCKED;
      res.status( HttpStatusCode.OK ).json( handleSuccess( response, HttpStatusCode.OK, result ))
    } catch (error) { 
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json(handleError(ResponseMessage.BLOCK_USER_FAILURE,HttpStatusCode.INTERNAL_SERVER_ERROR));
    }
  }

  //logOut
  async logOut(req: Request, res: Response): Promise<void> {
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
      res.status( HttpStatusCode.OK ).json( handleSuccess( ResponseMessage.LOGOUT_SUCCESS, HttpStatusCode.OK ));
    } catch (error) {
      res.status( HttpStatusCode.INTERNAL_SERVER_ERROR ).json( handleError( ResponseMessage.LOGOUT_FAILURE, HttpStatusCode.INTERNAL_SERVER_ERROR ));
    }
  }

  //isAuthenticated
  async isAuthenticated(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies?.token;
      console.log(token,"authenticatedToken")
      const responseObj = await this.adminUseCase.isAuthenticated(token)
      res.status( responseObj.status ).json( handleSuccess( responseObj.message, responseObj.status ))
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json( handleError( ResponseMessage.AUTHENTICATION_FAILURE, HttpStatusCode.INTERNAL_SERVER_ERROR) );
    }
  }
}
