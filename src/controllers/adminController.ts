import { Request, Response } from "express";
import { AdminUseCase } from "../usecase/adminUseCase";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import bcrypt from "bcrypt";
import { IAdminController } from "../interfaces/IAdmin";
import { JWTService } from "../framework/utils/jwtServices";
import { handleSuccess } from "../framework/utils/responseHandler";

export class AdminController implements IAdminController {
  constructor(
    private adminUseCase: AdminUseCase,
    private IJwtService: JWTService
  ) {}

  async adminLogin(req: Request, res: Response): Promise<Response | void> {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      const admin = await this.adminUseCase.findAdminByEmail(email);
      console.log(admin, "adminnnnnnnnnnnnn");
      if (!admin) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        admin.password as string
      );
      console.log(isPasswordValid, "isPasswordValid");

      if (!isPasswordValid) {
        return res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: "Invalid password" });
      }

      const payload = { adminId: admin._id };
      const accessToken = this.IJwtService.generateAccessToken(payload);
      const refreshToken = this.IJwtService.generateRefreshToken(payload);

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
    } catch (error) {
      console.error("Admin login error:", error);

      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "An error occurred during login",
      });
    }
  }

  async blockUsers(req: Request, res: Response): Promise<Response | void> {
    try {
      const userId = req.params.id;
      console.log(userId, "qwertyu");

      const result: any = await this.adminUseCase.blockUser(userId);

      // Check if the user was blocked and clear cookies if true
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

      const response = handleSuccess(
        `User ${result.isBlocked ? "blocked" : "unblocked"} successfully`,
        HttpStatusCode.OK,
        result
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to block events",
      });
    }
  }
}
