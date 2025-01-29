import { IAdmin } from "../../entities/admin.entity";
import { IUser } from "../../entities/user.entity";
import { IsAuthenticatedUseCaseRES } from "../common/IIsAuthenticated";

export default interface IAdminUseCase {
  adminLogin( email: string, password: string ): Promise<{ accessToken: string; refreshToken: string }>;
  findAdminByEmail(email: string): Promise<IAdmin | null>;
  blockUser(userId: string): Promise<IUser | null>;
  isAuthenticated( token: string | undefined): Promise<IsAuthenticatedUseCaseRES>;
}
