import bcrypt from "bcrypt";
import IAdminRepository from "../../../interfaces/repository/admin/admin.repository";
import IAdminServices from "../../../interfaces/services/admin/admin.services";
import { IJWTService, JWTPayload } from "../../../interfaces/integration/IJwt";
import { IsAuthenticatedUseCaseRES } from "../../../interfaces/common/IIsAuthenticated";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { JWTService } from "../../../integration/jwtServices";
import AdminAuthRepository from "../../../repositories/entities/adminRepositories/adminRepository";

export class AdminAuthService implements IAdminServices {
  private adminRepo: IAdminRepository
  private IjwtSevice: IJWTService
  constructor(
     adminRepo: IAdminRepository,
  ) {
    this .adminRepo = adminRepo
    this.IjwtSevice = new JWTService()
  }

  //Admin-login
  async adminLogin(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      console.log(email, password, "qwertyuiop");

      const admin = await this.adminRepo.findAdminByEmail(email);
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
      const accessToken = this.IjwtSevice.generateAccessToken(payload);
      const refreshToken = this.IjwtSevice.generateRefreshToken(payload);
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
      const decoded = this.IjwtSevice.verifyAccessToken(token) as JWTPayload;
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