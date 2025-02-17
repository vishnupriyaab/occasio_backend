import { IAdmin } from "../entities/admin.entity";
import { IUser } from "../entities/user.entity";
import { IsAuthenticatedUseCaseRES } from "../interfaces/common/IIsAuthenticated";
import { IJWTService, JWTPayload } from "../interfaces/utils/IJwt";
import IAdminRepository from "../interfaces/repository/admin.Repository";
import IAdminUseCase from "../interfaces/useCase/admin.useCase";
import { IEmployee } from "../entities/employee.entity";

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

      const payload = { id: admin._id ,role: "admin"};
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
    try {
      return await this.adminRepo.findAdminByEmail(email);
    } catch (error) {
      throw error
    }
  }

  async blockUser(userId:string):Promise<IUser | null>{
    try {
      const user = await this.adminRepo.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      user.isBlocked = !user.isBlocked;
      return await this.adminRepo.updateStatus(userId, { isBlocked: user.isBlocked });
    } catch (error) {
      throw error
    }
  }

  async isAuthenticated(
      token: string | undefined
    ): Promise<IsAuthenticatedUseCaseRES> {
      try {
        if (!token) {
          return { message: "Unauthorized: No token provided", status: 401 };
        }
        const decoded = this.IjwtSevice.verifyAccessToken(token) as JWTPayload;
        console.log(decoded,"23456789000987654")
        if (decoded.role?.toLowerCase() !== "admin") {
          return { message: "No access admin", status: 401 };
        }
        return { message: "Admin is Authenticated", status: 200 };
      } catch (error) {
        throw error;
      }
    }

    async searchEmployee(
      searchTerm: string,
      filterStatus: string | undefined,
      page: number,
      limit: number
    ): Promise<{
      employee: IEmployee[];
      totalEmployees: number;
      totalPages: number;
      currentPage: number;
    }> {
      try {
        if (page < 1) throw new Error("Page number must be positive");
        if (limit < 1) throw new Error("Limit must be positive");
  
        return await this.adminRepo.searchEmployee(
          searchTerm,
          filterStatus,
          page,
          limit
        );
      } catch (error) {
        throw error;
      }
    }

    async searchUser(
      searchTerm: string,
      filterStatus: string | undefined,
      page: number,
      limit: number
    ): Promise<{
      users: IUser[];
      totalUsers: number;
      totalPages: number;
      currentPage: number;
    }> {
      try {
        if (page < 1) throw new Error("Page number must be positive");
        if (limit < 1) throw new Error("Limit must be positive");
  
        return await this.adminRepo.searchUser(
          searchTerm,
          filterStatus,
          page,
          limit
        );
      } catch (error) {
        throw error;
      }
    }

    async blockEmployee(employeeId:string):Promise<IEmployee | null>{
      try {
        const user = await this.adminRepo.findByEmployeeId(employeeId);
        if (!user) {
          throw new Error('employee not found');
        }
        user.isBlocked = !user.isBlocked;
        return await this.adminRepo.updateEmployeeStatus(employeeId, { isBlocked: user.isBlocked });
      } catch (error) {
        throw error;
      }
    }

}
