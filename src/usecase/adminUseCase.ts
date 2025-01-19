import { IAdmin } from "../entities/admin.entity";
import { IUser } from "../entities/user.entity";
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
  }

  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    return await this.adminRepo.findAdminByEmail(email);
  }

  async blockUser(userId:string):Promise<IUser | null>{
    const user = await this.adminRepo.findById(userId);
    if (!user) {
      throw new Error('Event not found');
    }
    
    user.isBlocked = !user.isBlocked;
    return await this.adminRepo.updateStatus(userId, { isBlocked: user.isBlocked });
  }

}
