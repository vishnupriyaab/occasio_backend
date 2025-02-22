import { IAdmin } from "../../entities/admin.entity";

export default interface IAdminRepository{
    findAdminByEmail(email: string): Promise<IAdmin | null>
}