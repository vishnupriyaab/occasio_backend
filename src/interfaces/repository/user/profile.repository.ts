import { IUser } from "../../entities/user.entity";

export default interface IUserProfRepository{
    findUserById(userId: string): Promise<IUser | null>
    findUserByEmail(email: string): Promise<IUser | null>
    updateUserProfileImage(userId: string, imageUrl: string): Promise<IUser | null>;
    updateUserProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
}