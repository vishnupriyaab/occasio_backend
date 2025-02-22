import { IUser } from "../../../interfaces/entities/user.entity";
import IUserRepository from "../../../interfaces/repository/admin/user.repository";
import IUserService from "../../../interfaces/services/admin/user.services";
import AdminUserRepository from "../../../repositories/entities/adminRepositories/userRepository";

export class AdminUserService implements IUserService {
  private userRepo: IUserRepository
  constructor( userRepo: IUserRepository ) {
    this. userRepo = userRepo
  }

  //block-Unblock User
  async blockUser(userId: string): Promise<IUser | null> {
    try {
      const user = await this.userRepo.findUserById(userId);
      if (!user) {
        const error = new Error("User not found");
        error.name = "UserNotFound";
        throw error;
      }

      user.isBlocked = !user.isBlocked;
      const result = await this.userRepo.updateUserBlockStatus(userId, {
        isBlocked: user.isBlocked,
      });
      console.log(result,"1111111111111111111111111111111111111")
      return result;
    } catch (error:unknown) {
      throw error;
    }
  }

  //SearchUser
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
      if (page < 1 || limit < 1) {
        const error = new Error("Invalid Page Or Limit");
        error.name = "InvalidPageOrLimit";
        throw error;
      }

      return await this.userRepo.searchUser(
        searchTerm,
        filterStatus,
        page,
        limit
      );
    } catch (error) {
      throw error;
    }
  }
}

const adminUserRepository = new AdminUserRepository();
export const adminUserServices = new AdminUserService(adminUserRepository);
