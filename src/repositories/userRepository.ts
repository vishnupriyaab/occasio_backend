import Users from "../framework/models/userModel";
import { IRegisterUser, IUser } from "../entities/user.entity";
import { IUserRepository } from "../interfaces/IUser";

export class UserRepository implements IUserRepository {
  async createUser(user: IRegisterUser): Promise<IUser | never> {
    try {
      const newUser = new Users(user);
      console.log("new user is createddd!!");
      return newUser.save();
    } catch (error) {
      console.log("Error creating user...", error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await Users.findOne({ email: email });
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }
  async updateUserStatus( email: string, isVerified: boolean ): Promise<IUser | null> {
    try {
      const updatedUser = await Users.findOneAndUpdate(
        { email: email },
        { $set: { isVerified: isVerified } },
        { new: true }
      ).exec();

      return updatedUser ? updatedUser.toObject() : null;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  }

  async updateActivatedStatus(email:string, isActivated:boolean):Promise <IUser | null>{
    try {
      const updatedActivatedStatus = await Users.findOneAndUpdate(
        { email: email },
        { $set: { isActivated: isActivated } },
        { new: true }
      ).exec();

      return updatedActivatedStatus ? updatedActivatedStatus.toObject() : null;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    console.log(email, "userrepooo");
    // console.log(Users.findOne({email}),"1234567890")
    return await Users.findOne({ email });
  }

  async savePasswordResetToken(userId: string, token: string): Promise<void> {
    await Users.updateOne(
      { _id: userId },
      { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 },
      { upsert: true }
    );
  }
  
  async findUserById(userId: string): Promise<IUser | null> {
    return await Users.findById(userId).exec();
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    const result = await Users.findByIdAndUpdate(
      userId,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    ).exec();

    if (!result) {
      throw new Error("Failed to update password");
    }
  }

  async getPasswordResetToken(userId: string): Promise<string | null> {
    const user = await Users.findById(userId)
      .select("resetPasswordToken")
      .exec();
    return user?.resetPasswordToken || null;
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    await Users.findByIdAndUpdate(userId, {
      $unset: {
        resetPasswordToken: 1,
      },
    }).exec();
  }

  async createGoogleUser(userData: IUser): Promise<IUser> {
    console.log("qwertyu12345678dfghjkl");
    try {
      console.log(userData,"userdatatatatatat")
      const user = new Users(userData);
      console.log("new user is createddd!!",user);
      return await user.save();
    } catch (error) {
      console.log("Error creating user...", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    return Users.find().sort({ createdAt: -1 });
  }

}
