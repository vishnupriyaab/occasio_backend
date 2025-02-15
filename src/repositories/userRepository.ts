import Users from "../framework/models/userModel";
import { IRegisterUser, IUser } from "../entities/user.entity";
import IUserRepository from "../interfaces/repository/user.Repository";
import mongoose from "mongoose";

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

  async updateUserStatus(
    email: string,
    isVerified: boolean
  ): Promise<IUser | null> {
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

  async updateActivatedStatus(
    email: string,
    isActivated: boolean
  ): Promise<IUser | null> {
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
    try {
      console.log(email, "userrepooo");
      return await Users.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async savePasswordResetToken(userId: string, token: string): Promise<void> {
    try {
      await Users.updateOne(
        { _id: userId },
        {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000,
        },
        { upsert: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async findUserById(userId: string): Promise<IUser | null> {
    try {
      return await Users.findById(userId).exec();
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async getPasswordResetToken(userId: string): Promise<string | null> {
    try {
      const user = await Users.findById(userId)
        .select("resetPasswordToken")
        .exec();
      return user?.resetPasswordToken || null;
    } catch (error) {
      throw error;
    }
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    try {
      await Users.findByIdAndUpdate(userId, {
        $unset: {
          resetPasswordToken: 1,
        },
      }).exec();
    } catch (error) {
      throw error;
    }
  }

  async createGoogleUser(userData: IUser): Promise<IUser> {
    console.log("qwertyu12345678dfghjkl");
    try {
      console.log(userData, "userdatatatatatat");
      const user = new Users(userData);
      console.log("new user is createddd!!", user);
      return await user.save();
    } catch (error) {
      console.log("Error creating user...", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      return Users.find().sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  async searchUser(
    searchTerm: string,
    filterStatus: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    users: IUser[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const query: mongoose.FilterQuery<IUser> = {};
      if (searchTerm && searchTerm.trim() !== "") {
        query.name = {
          $regex: searchTerm.trim(),
          $options: "i",
        };
      }

      if (filterStatus === "blocked") {
        query.isBlocked = true;
      } else if (filterStatus === "unblocked") {
        query.isBlocked = false;
      }
      const skip = Math.max(0, (page - 1) * limit);
      const [users, totalUsers] = await Promise.all([
        Users.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
          Users.countDocuments(query),
      ]);
      const totalPages = Math.max(1, Math.ceil(totalUsers / limit))

      return{
        users,
        totalUsers,
        totalPages,
        currentPage: page,
      }

    } catch (error) {
      throw error;
    }
  }
}
