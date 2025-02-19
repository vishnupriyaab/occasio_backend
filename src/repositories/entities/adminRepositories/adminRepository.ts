import { IAdmin } from "../../../entities/admin.entity";
import Admin from "../../../framework/models/adminModel";
import IAdminRepository from "../../../interfaces/repository/admin/admin.repository";
import AdminBaseRepositoy from "../../baseRepository/adminBaseRepository/adminBaseRepository";

export default class AdminRepository
  extends AdminBaseRepositoy<{ admin: Document & IAdmin }>
  implements IAdminRepository
{
  constructor() {
    super({ admin: Admin });
  }
  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    return this.findOne("admin", { email });
  }
}
