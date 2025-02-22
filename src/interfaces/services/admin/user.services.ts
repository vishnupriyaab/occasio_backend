import { IUser } from "../../entities/user.entity";

export default interface IUserService{
    blockUser(userId:string):Promise<IUser | null>
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