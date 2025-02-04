import { IAdmin } from "../entities/admin.entity";
import { IUser } from "../entities/user.entity";
import Admin from "../framework/models/adminModel";
import Users from "../framework/models/userModel";
import bcrypt from "bcrypt";
import IAdminRepository from "../interfaces/repository/admin.Repository";

export class AdminRepository implements IAdminRepository {

  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    try {
      console.log(email, "userrepooo");
      return await Admin.findOne({ email: email });
    } catch (error) {
      throw error
    }
  }

  async validateCredentials(email: string, password: string): Promise<boolean> {
    try {
      const admin = await this.findAdminByEmail(email);
      if (!admin?.password) return false;
      return await bcrypt.compare(password, admin.password);
    } catch (error) {
      throw error
    }
  }

  async findById(id:string):Promise<IUser | null> {
    try {
      return await Users.findById(id);
    } catch (error) {
      throw error
    }
  }

  async updateStatus(id:string, updateData:any):Promise<IUser | null> {
    try {
      return await Users.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error
    }
  }
}
