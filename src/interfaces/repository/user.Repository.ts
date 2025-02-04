import { IRegisterUser, IUser } from "../../entities/user.entity";

export default interface IUserRepository {
  createUser(user: IRegisterUser): Promise<IUser | never>;
  findByEmail(email: string): Promise<IUser | null>;
  updateUserStatus(email: string, isVerified: boolean): Promise<IUser | null>;
  updateActivatedStatus(
    email: string,
    isActivated: boolean
  ): Promise<IUser | null>;
  findUserByEmail(email: string): Promise<IUser | null>;
  savePasswordResetToken(userId: string, token: string): Promise<void>;
  findUserById(userId: string): Promise<IUser | null>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  getPasswordResetToken(userId: string): Promise<string | null>;
  clearPasswordResetToken(userId: string): Promise<void>;
  createGoogleUser(userData: IUser): Promise<IUser>;
  getAllUsers(): Promise<IUser[]>;
  searchUser(searchTerm: string): Promise<IUser[] | null>;
}
