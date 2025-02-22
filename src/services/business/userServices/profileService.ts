import { IProfile, IUser } from "../../../interfaces/entities/user.entity";
import { CryptoService } from "../../../integration/cryptoServices";
import { ICryptoService } from "../../../interfaces/integration/ICrypto";
import IUserProfRepository from "../../../interfaces/repository/user/profile.repository";
import IUserProfServices from "../../../interfaces/services/user/profile.services";
import { UserProfRepository } from "../../../repositories/entities/userRepositories/profileRepository";

export class UserProfServices implements IUserProfServices{
  private _userRepo: IUserProfRepository;
  private _cryptoService: ICryptoService;
  constructor(userRepo: IUserProfRepository, cryptoService: ICryptoService) {
    this._userRepo = userRepo;
    this._cryptoService = cryptoService;
  }

  async showProfile(userId: string): Promise<IProfile> {
    try {
      const user = await this._userRepo.findUserById(userId);
      if (!user) {
        const error = new Error("User not found");
        error.name = "UserNotFound";
        throw error;
      }
      const userProfile = {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        imageUrl: user.imageUrl,
        isVerified: user.isVerified,
        isActivated: user.isActivated,
        createdAt: user.createdAt,
      };
      console.log(userProfile, "12345678901");
      return userProfile;
    } catch (error) {
      throw error;
    }
  }

  async updateProfileImage(
    image: string,
    userId: string
  ): Promise<IUser | null> {
    try {
      const updatedUser = await this._userRepo.updateUserProfileImage(
        userId,
        image
      );
      if (!updatedUser) {
        const error = new Error("User not found or update failed");
        error.name = "UserNotFound";
        throw error;
      }
      return updatedUser;
    } catch (error) {
      console.error("Error in updateProfileImage:", error);
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      const { name, email, password } = updateData;

      if (email) {
        const existingUser = await this._userRepo.findUserByEmail(email);
        if (existingUser && existingUser._id.toString() !== userId) {
          const error = new Error("Email already in use by another user");
          error.name = "EmailAlreadyUse";
          throw error;
        }
      }
      if (password) {
        const hashedPassword = await this._cryptoService.hashData(password);
        updateData.password = hashedPassword;
      }

      const updatedUser = await this._userRepo.updateUserProfile(
        userId,
        updateData
      );
      if (!updatedUser) {
        const error = new Error('User not found');
        error.name = 'UserNotFound'
        throw error;
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}


const userProfRepository = new UserProfRepository();
const cryptoService: ICryptoService = new CryptoService();

export const userProfileServices = new UserProfServices(
  userProfRepository,
  cryptoService
);
