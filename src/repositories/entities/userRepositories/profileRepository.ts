import { IUser } from "../../../interfaces/entities/user.entity";
import IUserProfRepository from "../../../interfaces/repository/user/profile.repository";
import Users from "../../../models/userModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class UserProfRepository
  extends CommonBaseRepository<{ user: IUser & Document }>
  implements IUserProfRepository
{
  constructor() {
    super({ user: Users });
  }

  async findUserById(userId: string): Promise<IUser | null> {
    return this.findById("user", userId);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return this.findOne("user", { email });
  }

  async updateUserProfileImage(userId: string, imageUrl: string): Promise<IUser | null> {
    try {
      return await this.updateById("user", userId, { imageUrl });
    } catch (error) {
      console.error("Error updating user profile image:", error);
      throw error;
    }
  }
  
  async updateUserProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      return await this.updateById("user", userId, updateData);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

}
