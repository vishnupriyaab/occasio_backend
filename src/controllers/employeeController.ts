import { Request, Response } from "express";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import { handleError, handleSuccess } from "../integration/responseHandler";
import { ResponseMessage } from "../constant/responseMsg";
import IEmployeeController from "../interfaces/controller/employee.controller";
import { IEmployeeUseCase } from "../interfaces/useCase/employee.useCase";
import { AuthenticatedRequest } from "../middleware/authenticateToken";

export class EmployeeController implements IEmployeeController {
  constructor( private employeeUseCase: IEmployeeUseCase ) {}

  //Employee - register
  async registerEmployee(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, mobile, password } = req.body;
      console.log(name, email, mobile, password, "req.bodyyyy ");
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
      const employee = await this.employeeUseCase.registerEmployee({
        name,
        email,
        mobile,
        password,
      });

      res
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(
            ResponseMessage.EMPLOYEE_REGISTER_SUCCESS,
            HttpStatusCode.CREATED,
            employee
          )
        );
      return;
    } catch (error) {
      console.error("Employee register error:", error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.EMPLOYEE_REGISTER_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  //Verify - OTP
  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      console.log(email, otp, "req.body");
      const result = await this.employeeUseCase.verifyOtp(email, otp);
      // console.log(result,"resulttMahn")
      res
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(ResponseMessage.OTP_VERIFIED, HttpStatusCode.OK, result)
        );
    } catch (error) {
      console.log("verifyOtp error: ", error);
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

  //Employee - Login
  async employeeLogin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    console.log(email, password, "employeelogin");
    try {
      const { accessToken, refreshToken } =
        await this.employeeUseCase.loginEmployee(email, password);
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
      return;
    } catch (error) {
      console.error("Error during OTP resend", error);
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
      await this.employeeUseCase.forgotPassword(email);
      res
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(
            ResponseMessage.PASSWORD_RESET_LINK_SENT,
            HttpStatusCode.OK
          )
        );
      return;
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

  //resetPassword
  async resetPassword(req: Request, res: Response): Promise<void> {
    const { password, token } = req.body;
    console.log(password, token, "req.bodyyy");
    try {
      await this.employeeUseCase.resetPassword(token, password);
      res
        .status(HttpStatusCode.OK)
        .json(
          handleSuccess(
            ResponseMessage.PASSWORD_RESET_SUCCESS,
            HttpStatusCode.OK
          )
        );
      return;
    } catch (error) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json(
          handleError(
            ResponseMessage.PASSWORD_RESET_FAILURE,
            HttpStatusCode.BAD_REQUEST
          )
        );
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

  async showProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
      try {
        console.log(req.id, "Vishnu12345"); //editProfile
        const userId = req.id;
        if (!userId) {
          res
            .status(HttpStatusCode.BAD_REQUEST)
            .json(handleError("User ID is required", HttpStatusCode.BAD_REQUEST));
          return;
        }
  
        const profile = await this.employeeUseCase.showProfile(userId);
        res
          .status(HttpStatusCode.OK)
          .json(
            handleSuccess(
              "Profile fetched successfully",
              HttpStatusCode.OK,
              profile
            )
          );
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

    async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
      try {
        const userId:string = req.id || "";
        const { name, email, password, confirmPassword } = req.body;
        console.log(name, email, password, confirmPassword, "1111111111111");
        if (!name || !email || !password || !confirmPassword) {
          res
            .status(HttpStatusCode.BAD_REQUEST)
            .json(
              handleError("All fields are required", HttpStatusCode.BAD_REQUEST)
            );
          return;
        }
  
        if (password !== confirmPassword) {
          res
            .status(HttpStatusCode.BAD_REQUEST)
            .json(
              handleError("Passwords do not match", HttpStatusCode.BAD_REQUEST)
            );
          return;
        }
        const updatedUser = await this.employeeUseCase.updateProfile(userId, {
          name,
          email,
          password,
        });
        res
          .status(HttpStatusCode.OK)
          .json(
            handleSuccess(
              "Profile updated successfully",
              HttpStatusCode.OK,
              updatedUser
            )
          )
      } catch (error: any) {
        res
          .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
          .json(
            handleError(
              error.message || "Failed to update profile",
              HttpStatusCode.INTERNAL_SERVER_ERROR
            )
          );
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
          res
            .status(HttpStatusCode.BAD_REQUEST)
            .json(handleError("Image is required", HttpStatusCode.BAD_REQUEST));
          return;
        }
  
        const updatedUser = await this.employeeUseCase.updateProfileImage(
          image,
          userId
        );
        res
          .status(HttpStatusCode.OK)
          .json(handleSuccess("Profile image upadted", HttpStatusCode.OK));
      } catch (error) {}
    }

  //isAuthenticated
  async isAuthenticated(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.cookies, "qwertyu");
      const token = req.cookies.access_token;
      console.log(token, "authenticatedToken");
      const responseObj = await this.employeeUseCase.isAuthenticated(token);
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
