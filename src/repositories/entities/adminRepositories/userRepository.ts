import { IUser } from "../../../entities/user.entity";
import Users from "../../../models/userModel";
import IUserRepository from "../../../interfaces/repository/admin/user.repository";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import { FilterQuery } from "mongoose";

export default class AdminUserRepository
  extends CommonBaseRepository<{ user: Document & IUser }>
  implements IUserRepository
{
  constructor() {
    super({ user: Users });
  }

  async findUserById(id: string): Promise<IUser | null> {
    return this.findById("user", id);
  }

  async updateUserBlockStatus(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return this.updateById("user", id, updateData);
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
      console.log(searchTerm, filterStatus, page, limit, "vishnupriya");

      const query: FilterQuery<IUser> = {};

      if (searchTerm?.trim()) {
        query.name = { $regex: searchTerm.trim(), $options: "i" };
      }

      let status = filterStatus;
      try {
        if (
          filterStatus &&
          typeof filterStatus === "string" &&
          filterStatus.startsWith("{")
        ) {
          const parsedFilter = JSON.parse(filterStatus);
          status = parsedFilter.status;
        }
      } catch (e) {
        console.error("Error parsing filterStatus:", e);
        status = "all";
      }

      if (status && status !== "all") {
        query.isBlocked = status === "blocked";
      }

      const skip = Math.max(0, (page - 1) * limit);

      const [users, totalUsers] = await Promise.all([
        this.findMany("user", query, { skip, limit, sort: { createdAt: -1 } }),
        this.count("user", query),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalUsers / limit));

      return {
        users,
        totalUsers,
        totalPages: totalPages,
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }
}
