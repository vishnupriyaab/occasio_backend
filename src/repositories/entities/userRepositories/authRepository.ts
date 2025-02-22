import { IRegisterUser, IUser } from "../../../interfaces/entities/user.entity";
import IUserAuthRepository from "../../../interfaces/repository/user/auth.repository";
import Users from "../../../models/userModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class UserAuthRepository
  extends CommonBaseRepository<{ user: Document & IUser }>
  implements IUserAuthRepository
{
  constructor() {
    super({ user: Users });
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return this.findOne("user", { email });
  }

  async createUser(user: IRegisterUser): Promise<IUser | never> {
    return this.createData("user", user);
  }

  async findUserById(userId: string): Promise<IUser | null> {
    return this.findById("user", userId);
  }

  async updateActivatedStatus(
    email: string,
    isActivated: boolean
  ): Promise<IUser | null> {
    return this.findOneAndUpdate("user", { email }, { isActivated });
  }

  async savePasswordResetToken(userId: string, token: string): Promise<void> {
    await this.updateOne(
      "user",
      { _id: userId },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000, // 1 hour expiry
      },
      { upsert: true }
    );
    return;
  }

  async getPasswordResetToken(userId: string): Promise<string | null> {
    const user = await this.findById("user", userId)
      .select("resetPasswordToken")
      .exec();
    return user?.resetPasswordToken || null;
  }

  async updatePassword(
    userId: string,
    hashedPassword: string
  ): Promise<void> {
    const result = await this.updateById("user", userId, {
      password: hashedPassword,
    });

    if (!result) {
      throw new Error("Failed to update password");
    }
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    try {
      await this.updateById(
        "user", 
        userId, 
        { $unset: { resetPasswordToken: 1 } }
      );
    } catch (error) {
      throw error;
    }
  }

  async createGoogleUser(userData: IUser): Promise<IUser> {
    try {
      return await this.createData("user", userData);
    } catch (error) {
      throw error;
    }
  }

}
