import { IAdmin } from "../entities/admin.entity";
import { JWTService } from "../framework/utils/jwtServices";
import { AdminLoginResponse, IAdminUseCase } from "../interfaces/IAdmin";
import { AdminRepository } from "../repositories/adminRepository";

export class AdminUseCase implements IAdminUseCase {
  constructor(
    private adminRepo: AdminRepository,
    private IjwtSevice:JWTService
  ) {}

  async adminLogin(email: string, password: string):Promise<AdminLoginResponse> {
    console.log(email, password, "qwertyuiop");

    const admin = await this.adminRepo.findAdminByEmail(email);
    if (!admin) {
      return { success: false, error: 'Admin not found' };
    }


    const isValid = await this.adminRepo.validateCredentials(email, password);
      if (!isValid) {
        return { success: false, error: 'Invalid credentials' };
      }

      const payload = { adminId: admin._id };
      const accessToken = this.IjwtSevice.generateAccessToken(payload);
      const refreshToken = this.IjwtSevice.generateRefreshToken(payload);

      return {
        success: true,
        accessToken,
        refreshToken
      };
    // const adminEmail = this.adminRepo.getAdminEmail();
    // const adminPassword = this.adminRepo.getAdminPassword();

    // console.log(adminEmail, adminPassword, "Heyyyh");
  }

  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    return await this.adminRepo.findAdminByEmail(email);
  }
}
