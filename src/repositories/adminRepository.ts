import { IAdmin, IAdminRegister } from "../entities/admin.entity";
import { IUser } from "../entities/user.entity";
import Admin from "../framework/models/adminModel";
import Users from "../framework/models/userModel";
import { IAdminRepository } from "../interfaces/IAdmin";
import bcrypt from "bcrypt";

export class AdminRepository implements IAdminRepository {

  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    console.log(email, "userrepooo");
    return await Admin.findOne({ email });
  }

  async validateCredentials(email: string, password: string): Promise<boolean> {
    const admin = await this.findAdminByEmail(email);
    if (!admin?.password) return false;
    return await bcrypt.compare(password, admin.password);
  }

  async findById(id:string):Promise<IUser | null> {
    return await Users.findById(id);
  }

  async updateStatus(id:string, updateData:any):Promise<IUser | null> {
    return await Users.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }
}
