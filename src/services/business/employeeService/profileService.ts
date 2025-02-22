import { IEmployee } from "../../../interfaces/entities/employee.entity";
import { IProfile } from "../../../interfaces/entities/user.entity";
import { CryptoService } from "../../../integration/cryptoServices";
import { ICryptoService } from "../../../interfaces/integration/ICrypto";
import IProfileRepository from "../../../interfaces/repository/employee/profile.repository";
import IEmplProfileService from "../../../interfaces/services/employee/profile.services";
import { EmplProfileRepository } from "../../../repositories/entities/employeeRepositories/profileRepository";

export class EmplProfileService implements IEmplProfileService{
  private _profileRepo: IProfileRepository;
  private _cryptoService: ICryptoService;
  constructor(profileRepo: IProfileRepository, cryptoService: ICryptoService) {
    this._cryptoService = cryptoService;
    this._profileRepo = profileRepo;
  }

  async showProfile(userId: string): Promise<IProfile> {
    try {
      const user = await this._profileRepo.findEmplById(userId);
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
      return userProfile;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    updateData: Partial<IEmployee>
  ): Promise<IEmployee | null> {
    try {
      const { name, email, password } = updateData;

      if (email) {
        const existingUser = await this._profileRepo.findEmplByEmail(email);
        if (existingUser && existingUser._id.toString() !== userId) {
            const error = new Error('Email already in use by another user');
            error.name = 'EmailAlreadyUse'
            throw error;
        }
      }
      if (password) {
        const hashedPassword = await this._cryptoService.hashData(password);
        updateData.password = hashedPassword;
      }

      const updatedUser = await this._profileRepo.updateUserProfile(
        userId,
        updateData
      );
      if (!updatedUser) {
        const error = new Error('User not found or update failed');
        error.name = 'UserNotFound';
        throw error;
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateProfileImage(image:string, userId: string):Promise<IEmployee | null>{
    try {
    console.log(image,"image")
    const updatedUser = await this._profileRepo.updateUserProfileImage(userId, image);
    console.log(updatedUser,".,mnpokj")
    if (!updatedUser) {
        const error = new Error('User not found or update failed');
        error.name = 'UserNotFound';
        throw error;
    }
    return updatedUser;
    } catch (error) {
      console.error('Error in updateProfileImage:', error);
      throw error;
    }
  }
}

const emplProfileRepository = new EmplProfileRepository();
const cryptoService: ICryptoService = new CryptoService();

export const emplProfileServices = new EmplProfileService(
  emplProfileRepository,
  cryptoService
);
