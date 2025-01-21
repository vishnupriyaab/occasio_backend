import { AdminLoginResponse, IAdmin } from "../entities/admin.entity";
import { IUser } from "../entities/user.entity";
import { IAdminRepository, IAdminUseCase } from "../interfaces/IAdmin";
import { IsAuthenticatedUseCaseRES } from "../interfaces/IIsAuthenticated";
import { IJWTService, JWTPayload } from "../interfaces/IJwt";

export class AdminUseCase implements IAdminUseCase {
  constructor(
    private adminRepo: IAdminRepository,
    private IjwtSevice:IJWTService
  ) {}

  async adminLogin(email: string, password: string):Promise<{ accessToken: string; refreshToken: string }> {
    try {
      console.log(email, password, "qwertyuiop");

    const admin = await this.adminRepo.findAdminByEmail(email);
    console.log(admin,"admin")
    if (!admin) {
      throw new Error('Admin not found')
    }


    const isValid = await this.adminRepo.validateCredentials(email, password);
      if (!isValid) {
        throw new Error('Invalid credentials')
      }

      const payload = { adminId: admin._id };
      const accessToken = this.IjwtSevice.generateAccessToken(payload);
      const refreshToken = this.IjwtSevice.generateRefreshToken(payload);

      return {
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
    
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

  async isAuthenticated(
      token: string | undefined
    ): Promise<IsAuthenticatedUseCaseRES> {
      try {
        if (!token) {
          return { message: "Unauthorized: No token provided", status: 401 };
        }
        const decoded = this.IjwtSevice.verifyAccessToken(token) as JWTPayload;
        if (decoded.role?.toLowerCase() !== "admin") {
          return { message: "Unauthorized: No token provided", status: 401 };
        }
        return { message: "User is Authenticated", status: 200 };
      } catch (error) {
        // return { message: "Forbidden: Invalid token", status: 403 };
        throw error;
      }
    }

}
