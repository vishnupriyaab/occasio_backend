import { IUser } from "../../entities/user.entity";

export default interface IUserRepository{
    findUserById(id: string): Promise<IUser | null>
    updateUserBlockStatus(id: string, updateData: any): Promise<IUser | null>;
    searchUser(
        searchTerm: string,
        filterStatus: string | undefined,
        page: number,
        limit: number
      ): Promise<{
        users: IUser[];
        totalUsers: number;
        totalPages: number;
        currentPage: number;
      }>
}