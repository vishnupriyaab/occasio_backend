import { Request, Response } from "express";
import { IUserController, IUserUseCase } from "../interfaces/IUser";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import { handleError, handleSuccess } from "../framework/utils/responseHandler";

export class UserController implements IUserController {
  constructor(
    private userUserCase: IUserUseCase,
    
  ) {}
  async registerUser(req: Request, res: Response): Promise<Response | void> {
    try {
      const { name, email, mobile, password } = req.body;
      if (!name || !email || !mobile || !password) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(handleError("Allfields are required", 400));
        return;
      }
      const user = await this.userUserCase.registerUser({
        name,
        email,
        mobile,
        password,
      });
      const response = handleSuccess("User registerd Successfully!", 201, user);
      res.status(response.statusCode).json(response);
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "An unknown error occurred" });
      }
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<Response | void> {
    try {
      const { email, otp } = req.body;
      console.log(email, otp, "req.body");
      const result = await this.userUserCase.verifyOtp(email, otp);
      res.status(HttpStatusCode.OK).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "An unknown error occurred" });
      }
    }
  }

  async userLogin(req: Request, res: Response): Promise<Response | void> {
    const { email, password } = req.body;
    console.log(email, password);
    try {
      const { accessToken, refreshToken } = await this.userUserCase.loginUser(email, password);

      // Send tokens to the client
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
    } catch (error:any) {
      console.error("Login error:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<Response | void> {
    const { email } = req.body;
    console.log(email, "emailgot itttt");
    try {
      await this.userUserCase.forgotPassword(email);
      return res
        .status(HttpStatusCode.OK)
        .json({ message: "Password reset link sent to your email" });
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: error.message });
      } else {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "An unknown error occurred" });
      }
    }
  }
  async resetPassword(req: Request, res: Response): Promise<Response | void> {
    const { password, token } = req.body;
    try {
      // console.log(password, token,"password and token");
      await this.userUserCase.resetPassword(token, password);
      return res
        .status(HttpStatusCode.OK)
        .json({ message: "Password has been reset" });
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: error.message });
      } else {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "An unknown error occurred" });
      }
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

      console.log(jwtToken, "dfgtyuicvbnm,");
      const tokens = await this.userUserCase.execute(jwtToken);

      return res.status(HttpStatusCode.OK).json({
        message: "Successfully authenticated with Google",
        tokens,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: error.message });
      } else {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ message: "An unknown error occurred" });
      }
    }
  }
}
