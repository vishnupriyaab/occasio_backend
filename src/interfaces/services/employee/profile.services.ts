import { IEmployee } from "../../../entities/employee.entity";
import { IProfile } from "../../../entities/user.entity";

export default interface IEmplProfileService {
  showProfile(userId: string): Promise<IProfile>;
  updateProfile(
    userId: string,
    updateData: Partial<IEmployee>
  ): Promise<IEmployee | null>;
  updateProfileImage(image:string, userId: string):Promise<IEmployee | null>
}
