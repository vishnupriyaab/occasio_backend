import { IAdmin, IAdminRegister } from "../entities/admin.entity";
import Admin from "../framework/models/adminModel";
import { IAdminRepository } from "../interfaces/IAdmin";
import bcrypt from "bcrypt";

export class AdminRepository implements IAdminRepository {
  // getAdminEmail(): string {
  //     return process.env.ADMIN_EMAIL || '';
  // }

  // getAdminPassword(): string {
  //     return process.env.ADMIN_PASSWORD || '';
  // }

  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    console.log(email, "userrepooo");
    return await Admin.findOne({ email });
  }

  async validateCredentials(email: string, password: string): Promise<boolean> {
    const admin = await this.findAdminByEmail(email);
    if (!admin?.password) return false;
    return await bcrypt.compare(password, admin.password);
  }
}
