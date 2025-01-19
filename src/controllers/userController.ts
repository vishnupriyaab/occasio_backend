import { Request, Response } from "express";
import { IUserController, IUserUseCase } from "../interfaces/IUser";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import { handleError, handleSuccess } from "../framework/utils/responseHandler";

export class UserController implements IUserController {
  constructor(private userUserCase: IUserUseCase) {}
  async registerUser(req: Request, res: Response): Promise<Response | void> {
    try {
      const { name, email, mobile, password } = req.body;
      if (!name || !email || !mobile || !password) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(handleError("Allfields are required", HttpStatusCode.BAD_REQUEST));
        return;
      }
      const user = await this.userUserCase.registerUser({
        name,
        email,
        mobile,
        password,
      });
      // const response = handleSuccess("User registerd Successfully!", 201, user);
      // res.status(response.statusCode).json(response);
      // return;
      return res
        .status(HttpStatusCode.CREATED)
        .json(handleSuccess("User registered successfully!", HttpStatusCode.CREATED, user));
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(handleError(message, HttpStatusCode.INTERNAL_SERVER_ERROR));
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<Response | void> {
    try {
      const { email, otp } = req.body;
      console.log(email, otp, "req.body");
      const result = await this.userUserCase.verifyOtp(email, otp);
      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json(handleError(message, HttpStatusCode.BAD_REQUEST));
    }
  }

  async userLogin(req: Request, res: Response): Promise<Response | void> {
    const { email, password } = req.body;
    console.log(email, password);
    try {
      const { accessToken, refreshToken } = await this.userUserCase.loginUser(
        email,
        password
      );
      return res
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
        .status(HttpStatusCode.OK)
        .json({ message: "Login success", accessToken, refreshToken });
    } catch (error: any) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json(handleError(message, HttpStatusCode.UNAUTHORIZED));
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<Response | void> {
    const { email } = req.body;
    console.log(email, "emailgot itttt");
    try {
      await this.userUserCase.forgotPassword(email);
      return res
        .status(HttpStatusCode.OK)
        .json(handleSuccess("Password reset link sent to your email", HttpStatusCode.OK));
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json(handleError(message, HttpStatusCode.BAD_REQUEST));
    }
  }

  async resetPassword(req: Request, res: Response): Promise<Response | void> {
    try {
      const { password, token } = req.body;
      await this.userUserCase.resetPassword(token, password);
      return res
        .status(HttpStatusCode.OK)
        .json(handleSuccess("Password has been reset", HttpStatusCode.OK));
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json(handleError(message, HttpStatusCode.BAD_REQUEST));
    }
  }

  async googleLogin(req: Request, res: Response): Promise<Response | void> {
    try {
      const { credential } = req.body;
      const jwtToken = credential.credential;
      if (!jwtToken) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Google credential is required",
        });
      }

      const tokens = await this.userUserCase.execute(jwtToken);
      return res
        .status(HttpStatusCode.OK)
        .json(handleSuccess("Successfully authenticated with Google", HttpStatusCode.OK, tokens));
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json(handleError(message, HttpStatusCode.BAD_REQUEST));
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userUserCase.getAllUsers();
      const response = handleSuccess(
        "Events fetched successfully",
        HttpStatusCode.OK,
        users
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to fetch users",
      });
    }
  }

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
      res.status(HttpStatusCode.OK).json({ message: "logout successfull" });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to Logout",
      });
    }
  }

  async isAuthenticated(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies?.token;
      console.log(token,"authenticatedToken")
      const responseObj = await this.userUserCase.isAuthenticated(token)
      res.status(responseObj.status).json({message:responseObj.message})
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to Authenticate",
      });
    }
  }
}
