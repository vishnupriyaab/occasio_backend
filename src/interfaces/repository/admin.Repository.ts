import { IAdmin } from "../../entities/admin.entity";
import { IUser } from "../../entities/user.entity";

export default interface IAdminRepository {
  findAdminByEmail(email: string): Promise<IAdmin | null>;
  validateCredentials(email: string, password: string): Promise<boolean>;
  findById(id: string): Promise<IUser | null>;
  updateStatus(id: string, updateData: any): Promise<IUser | null>;
}
