import { Request, Response } from "express";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import { handleError, handleSuccess } from "../framework/utils/responseHandler";
import { ResponseMessage } from "../constant/responseMsg";
import IUserUseCase from "../interfaces/useCase/user.useCase";
import IUserController from "../interfaces/controller/user.controller";

export class UserController implements IUserController {
  constructor(private userUserCase: IUserUseCase) {}

  //user-register
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, mobile, password } = req.body;
      if (!name || !email || !mobile || !password) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(
            handleError(
              ResponseMessage.FIELDS_REQUIRED,
              HttpStatusCode.BAD_REQUEST
            )
          );
        return;
      }
      const user = await this.userUserCase.registerUser({
        name,
        email,
        mobile,
        password,
      });
      res
        .status(HttpStatusCode.CREATED)
        .json(
          handleSuccess(
            ResponseMessage.USER_REGISTER_SUCCESS,
            HttpStatusCode.CREATED,
            user
          )
        );
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.USER_REGISTER_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  //verifyOtp
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      console.log(email, otp, "req.body");
      const result = await this.userUserCase.verifyOtp(email, otp);
      res
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(ResponseMessage.OTP_VERIFIED, HttpStatusCode.OK, result)
        );
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.OTP_VERIFICATION_FAILED,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  //resendOtp
  async resendOtp(req:Request,res:Response):Promise<void>{
    try {
      const { email } = req.body;
      
      if (!email) {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          handleError('Email is required', HttpStatusCode.BAD_REQUEST)
        );
        return;
      }

      const result = await this.userUserCase.resendOtp(email);
      
      res.status(HttpStatusCode.OK).json(
        handleSuccess('OTP resent successfully', HttpStatusCode.OK, result)
      );
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
        handleError(
          error.message || 'Failed to resend OTP',
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  //User-Login
  async userLogin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    console.log(email, password);
    try {
      const { accessToken, refreshToken } = await this.userUserCase.loginUser(
        email,
        password
      );
      res
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(ResponseMessage.LOGIN_SUCCESS, HttpStatusCode.OK, {
            accessToken,
            refreshToken,
          })
        );
      console.log(accessToken, refreshToken, "qwertyui");
    } catch (error: any) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.LOGIN_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  //forgotPassword
  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    console.log(email, "emailgot itttt");
    try {
      await this.userUserCase.forgotPassword(email);
      res
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(
            ResponseMessage.PASSWORD_RESET_LINK_SENT,
            HttpStatusCode.OK
          )
        );
    } catch (error) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json(
          handleError(
            ResponseMessage.PASSWORD_RESET_LINK_SENT,
            HttpStatusCode.BAD_REQUEST
          )
        );
    }
  }

  //resetPassword
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { password, token } = req.body;
      await this.userUserCase.resetPassword(token, password);
      res
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(
            ResponseMessage.PASSWORD_RESET_SUCCESS,
            HttpStatusCode.OK
          )
        );
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.PASSWORD_RESET_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  //googleLogin
  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { credential } = req.body;
      const jwtToken = credential.credential;
      if (!jwtToken) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(
            handleError(
              ResponseMessage.GOOGLE_CREDENTIAL_REQUIRED,
              HttpStatusCode.BAD_REQUEST
            )
          );
      }

      const { accessToken, refreshToken } = await this.userUserCase.execute(
        jwtToken
      );
      console.log(accessToken, refreshToken);

      res
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(
            ResponseMessage.GOOGLE_LOGIN_SUCCESS,
            HttpStatusCode.OK,
            { accessToken, refreshToken }
          )
        );
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.GOOGLE_LOGIN_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  //getUsers
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userUserCase.getAllUsers();
      res
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(ResponseMessage.FETCH_USER, HttpStatusCode.OK, users)
        );
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.FETCH_USER_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  //logout
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
      res
        .status(HttpStatusCode.OK)
        .json(handleSuccess(ResponseMessage.LOGOUT_SUCCESS, HttpStatusCode.OK));
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.LOGOUT_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  //isAuthenticated
  async isAuthenticated(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.cookies, "1234567890-");
      const token = req.cookies.access_token;
      console.log(token, "authenticatedToken");
      const responseObj = await this.userUserCase.isAuthenticated(token);
      res
        .status(responseObj.status)
        .json(handleSuccess(responseObj.message, responseObj.status));
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.AUTHENTICATION_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }


}
