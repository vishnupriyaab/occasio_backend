import { Request, Response } from "express";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import { handleError, handleSuccess } from "../framework/utils/responseHandler";
import { IEmployeeController, IEmployeeUseCase } from "../interfaces/IEmployee";
import { IJWTService } from "../interfaces/utils/IJwt";
import { ResponseMessage } from "../constant/responseMsg";

export class EmployeeController implements IEmployeeController {

  constructor(private employeeUseCase: IEmployeeUseCase, private IJwtService:IJWTService) {}

  //Employee - register
  async registerEmployee(req: Request, res: Response):Promise<void> {
    try {
      const { name, email, mobile, password } = req.body;
      console.log(name,email,mobile,password,"req.bodyyyy ");
      if (!name || !email || !mobile || !password) {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(handleError(ResponseMessage.FIELDS_REQUIRED, HttpStatusCode.BAD_REQUEST));
        return;
      }
      const employee = await this.employeeUseCase.registerEmployee({
        name,
        email,
        mobile,
        password,
      });
      
      res.status(HttpStatusCode.OK).json(handleSuccess(ResponseMessage.EMPLOYEE_REGISTER_SUCCESS, HttpStatusCode.CREATED, employee));
      return;
    } catch (error) {
      console.error("Employee register error:", error);
      res.status( HttpStatusCode.INTERNAL_SERVER_ERROR ).json( handleError( ResponseMessage.EMPLOYEE_REGISTER_FAILURE, HttpStatusCode.INTERNAL_SERVER_ERROR ));
    }
  }

  //Verify - OTP
  async verifyOtp(req: Request, res: Response):Promise<void> {
    try {
      const { email, otp } = req.body;
      console.log(email, otp, "req.body");
      const result = await this.employeeUseCase.verifyOtp(email,otp);
      // console.log(result,"resulttMahn")
      res.status( HttpStatusCode.OK ).json( handleSuccess( ResponseMessage.OTP_VERIFIED, HttpStatusCode.OK, result ));
    } catch (error) {
      console.log("verifyOtp error: ",error)
      res.status( HttpStatusCode.INTERNAL_SERVER_ERROR ).json( handleError( ResponseMessage.OTP_VERIFICATION_FAILED, HttpStatusCode.INTERNAL_SERVER_ERROR ));
    }
  }

  //Employee - Login
  async employeeLogin(req: Request, res: Response):Promise<void> {
    const { email, password } = req.body;
    console.log(email, password, "employeelogin");
    try {
      // const employee = await this.employeeUseCase.findEmployeeByEmail(email);
      const {accessToken, refreshToken} = await this.employeeUseCase.loginEmployee(email, password);
      // console.log(11, employee);
      // if (!employee) {
      //    res
      //     .status(HttpStatusCode.NOT_FOUND)
      //     .json(handleError(ResponseMessage.EMPLOYEE_NOT_FOUND, HttpStatusCode.NOT_FOUND));
      //     return
      // }
      // if (!employee.isVerified) {
      //    res.status(HttpStatusCode.FORBIDDEN).json(handleError(ResponseMessage.ACCOUND_NOT_VERIFIED,HttpStatusCode.FORBIDDEN));
      //   return;
      // }
      // if (employee.isBlocked) {
      //    res
      //     .status(HttpStatusCode.FORBIDDEN)
      //     .json(handleError(ResponseMessage.ACCOUNT_BLOCKED, HttpStatusCode.FORBIDDEN));
      //     return;
      // }

      // const isPasswordValid = await bcrypt.compare(
      //   password,
      //   employee.password as string
      // );
      // if (!isPasswordValid) {
      //    res
      //     .status(HttpStatusCode.UNAUTHORIZED)
      //     .json(handleError(ResponseMessage.INVALID_PASSWORD,HttpStatusCode.UNAUTHORIZED));
      //     return;
      // }

      // const payload = { employeeId: employee._id, role: "employee" };
      // const accessToken = this.IJwtService.generateAccessToken(payload);
      // const refreshToken = this.IJwtService.generateRefreshToken(payload);

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
        .json( handleSuccess( ResponseMessage.LOGIN_SUCCESS, HttpStatusCode.OK, { accessToken,refreshToken }));
        return;
    } catch (error) {
      console.error("Error during OTP resend", error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(handleError(ResponseMessage.LOGIN_FAILURE,HttpStatusCode.INTERNAL_SERVER_ERROR));
    }
  }

  //forgotPassword
  async forgotPassword(req: Request, res: Response):Promise<void> {
    const { email } = req.body;
    console.log(email, "emailgot itttt");
    try {
      await this.employeeUseCase.forgotPassword(email);
       res
        .status(HttpStatusCode.OK)
        .json(handleSuccess(ResponseMessage.PASSWORD_RESET_LINK_SENT,HttpStatusCode.OK));
        return
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError(ResponseMessage.PASSWORD_RESET_FAILURE,HttpStatusCode.INTERNAL_SERVER_ERROR))
    }
  }

  //resetPassword
  async resetPassword(req: Request, res: Response):Promise<void> {  
    const { password, token } = req.body;
    console.log(password,token,"req.bodyyy")
    try {
        await this.employeeUseCase.resetPassword(token, password);
         res.status(HttpStatusCode.OK).json(handleSuccess(ResponseMessage.PASSWORD_RESET_SUCCESS,HttpStatusCode.OK));
         return
    } catch (error) {
      res.status(HttpStatusCode.BAD_REQUEST).json(handleError(ResponseMessage.PASSWORD_RESET_FAILURE,HttpStatusCode.BAD_REQUEST));
    }
  }
}
