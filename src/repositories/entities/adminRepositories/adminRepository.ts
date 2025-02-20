import { IAdmin } from "../../../entities/admin.entity";
import Admin from "../../../models/adminModel";
import IAdminRepository from "../../../interfaces/repository/admin/admin.repository";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export default class AdminAuthRepository
  extends CommonBaseRepository<{ admin: Document & IAdmin }>
  implements IAdminRepository
{
  constructor() {
    super({ admin: Admin });
  }
  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    return this.findOne("admin", { email });
  }
}
