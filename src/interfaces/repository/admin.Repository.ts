import { IAdmin } from "../../entities/admin.entity";
import { IEmployee } from "../../entities/employee.entity";
import { IUser } from "../../entities/user.entity";

export default interface IAdminRepository {
  findAdminByEmail(email: string): Promise<IAdmin | null>;
  validateCredentials(email: string, password: string): Promise<boolean>;
  findById(id: string): Promise<IUser | null>;
  updateStatus(id: string, updateData: any): Promise<IUser | null>;
  searchEmployee(
    searchTerm: string,
    filterStatus: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    employee: IEmployee[];
    totalEmployees: number;
    totalPages: number;
    currentPage: number;
  }>;
  updateEmployeeStatus(id:string, updateData:any):Promise<IEmployee | null>
  findByEmployeeId(id:string):Promise<IEmployee | null>
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
  }>;
}
