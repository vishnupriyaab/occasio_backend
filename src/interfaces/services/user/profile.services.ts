import { IProfile, IUser } from "../../entities/user.entity";

export default interface IUserProfServices {
  showProfile(userId: string): Promise<IProfile>;
  updateProfileImage(image: string, userId: string): Promise<IUser | null>;
  updateProfile(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null>;
}
