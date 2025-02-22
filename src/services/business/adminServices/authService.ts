import bcrypt from "bcrypt";
import IAdminRepository from "../../../interfaces/repository/admin/admin.auth.repository";
import { IJWTService, JWTPayload } from "../../../interfaces/integration/IJwt";
import { IsAuthenticatedUseCaseRES } from "../../../interfaces/common/IIsAuthenticated";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { JWTService } from "../../../integration/jwtServices";
import AdminAuthRepository from "../../../repositories/entities/adminRepositories/adminAuthRepository";
import IAdminAuthServices from "../../../interfaces/services/admin/adminAuth.services";

export class AdminAuthService implements IAdminAuthServices {
  private _adminRepo: IAdminRepository
  private _IjwtSevice: IJWTService
  constructor(
     adminRepo: IAdminRepository,
  ) {
    this ._adminRepo = adminRepo
    this._IjwtSevice = new JWTService()
  }

  //Admin-login
  async adminLogin(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      console.log(email, password, "qwertyuiop");

      const admin = await this._adminRepo.findAdminByEmail(email);
      console.log(admin, "admin");
      if (!admin) {
        const error = new Error("Admin not found");
        error.name = "AdminNotFound";
        throw error;
      }

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        const error = new Error("Invalid credentials");
        error.name = "InvalidCredentials";
        throw error;
      }

      const payload = { id: admin._id, role: "admin" };
      const accessToken = this._IjwtSevice.generateAccessToken(payload);
      const refreshToken = this._IjwtSevice.generateRefreshToken(payload);
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  //isAuthenticated
  async isAuthenticated(
    token: string | undefined
  ): Promise<IsAuthenticatedUseCaseRES> {
    try {
      if (!token) {
        return { message: "Unauthorized: No token provided", status: 401 };
      }
      const decoded = this._IjwtSevice.verifyAccessToken(token) as JWTPayload;
      if (decoded.role?.toLowerCase() !== "admin") {
        const error = new Error("No access admin");
        error.name = "NoAccessAdmin";
        throw error;
      }

      return { message: "Admin is Authenticated", status: HttpStatusCode.OK };
    } catch (error) {
      throw error;
    }
  }
}


const adminAuthRepository = new AdminAuthRepository();
export const adminAuthServices = new AdminAuthService(adminAuthRepository)