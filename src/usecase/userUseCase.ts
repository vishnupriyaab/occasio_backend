import { IProfile, IRegisterUser, IUser } from "../entities/user.entity";
import { EmailService } from "../integration/emailService";
import { IJWTService, JWTPayload } from "../interfaces/integration/IJwt";
import { ICryptoService } from "../interfaces/integration/ICrypto";
import { CryptoService } from "../integration/cryptoServices";
import bcrypt from "bcrypt";
import { CloudinaryService } from "../integration/claudinaryService";
import { IsAuthenticatedUseCaseRES } from "../interfaces/common/IIsAuthenticated";
import { IGoogleAuthService } from "../interfaces/integration/IGoogleVerification";
import { ICloudinaryService } from "../interfaces/integration/IClaudinary";
import { otpResponse } from "../entities/otp.entity";
import { IEmailService } from "../interfaces/integration/IEmail";
import IUserUseCase from "../interfaces/useCase/user.useCase";
import IUserRepository from "../interfaces/repository/user.Repository";
import IOtpRepository from "../interfaces/repository/otp.Repository";

export class UserUseCase implements IUserUseCase {
  private emailService: IEmailService;
  private cryptoService: ICryptoService;
  private jwtService: IJWTService;
  private cloudinaryService: ICloudinaryService;
  private googleAuthService: IGoogleAuthService;

  constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOtpRepository,
    emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    },
    jwtService: IJWTService,
    googleAuthService: IGoogleAuthService
  ) {
    this.emailService = new EmailService(emailConfig);
    this.cryptoService = new CryptoService();
    this.cloudinaryService = new CloudinaryService();
    this.jwtService = jwtService;
    this.googleAuthService = googleAuthService;
  }

  async registerUser(user: IRegisterUser): Promise<IRegisterUser | null> {
    try {
      const existingUser = await this.userRepo.findByEmail(user.email);
      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await this.cryptoService.hashData(user.password);
      user.password = hashedPassword;
      const newUser = await this.userRepo.createUser(user);

      const otp = this.cryptoService.generateOtp();
      console.log(otp, "otp..........!");
      const hashedOtp = await this.cryptoService.hashData(otp);
      await this.otpRepo.createOtp(String(newUser.email), hashedOtp);

      await this.emailService.sendOtpEmail(user.email, otp);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<otpResponse> {
    try {
      const otpRecord = await this.otpRepo.findOtp(email);
      if (!otpRecord) {
        throw new Error("OTP not found or has expired");
      }

      const verified = await this.cryptoService.compareData(otp, otpRecord.otp);
      if (verified) {
        const updatedUser = await this.userRepo.updateUserStatus(email, true);
        await this.otpRepo.deleteOtp(email);
        return {
          success: true,
          message: "OTP verified successfully",
          user: updatedUser,
        };
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(email: string): Promise<otpResponse> {
    try {
      const existingUser = await this.userRepo.findUserByEmail(email);
      if (!existingUser) {
        throw new Error("User not found");
      }

      // Delete any existing OTP
      await this.otpRepo.deleteOtp(email);

      // Generate new OTP
    const otp = this.cryptoService.generateOtp();
    console.log(otp, "new otp generated");
    const hashedOtp = await this.cryptoService.hashData(otp);

    // Save new OTP
    await this.otpRepo.createOtp(email, hashedOtp);

    // Send OTP via email
    await this.emailService.sendOtpEmail(email, otp);

    return {
      success: true,
      message: "OTP resent successfully",
      user: existingUser
    }
    } catch (error) {
      throw error;
    }
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.userRepo.findUserByEmail(email);
      await this.userRepo.updateActivatedStatus(email, true);

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.isVerified) {
        throw new Error("Account not verified. Please verify your account.");
      }

      if (user.isBlocked) {
        throw new Error("Your account is blocked");
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password as string
      );
      if (!isPasswordValid) {
        throw new Error("Invalid Password");
      }
      const payload = { id: user._id, role: "user" };
      const accessToken = this.jwtService.generateAccessToken(payload);
      const refreshToken = this.jwtService.generateRefreshToken(payload);
      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.userRepo.findUserByEmail(email);
      if (!user) {
        throw new Error("User not found!");
      }
      const token = this.jwtService.generateAccessToken({
        id: user._id,
        role: "user",
      });
      await this.userRepo.savePasswordResetToken(user._id as string, token);
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await this.emailService.sendPasswordResetEmail(email, resetLink);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = this.jwtService.verifyAccessToken(token);

      if (!decoded.id) {
        throw new Error("Invalid reset token");
      }

      const user = await this.userRepo.findUserById(decoded.id);
      if (!user) {
        throw new Error("User not found");
      }

      const storedToken = await this.userRepo.getPasswordResetToken(
        decoded.id
      );
      if (!storedToken || storedToken !== token) {
        throw new Error("Invalid or expired reset token");
      }

      const hashedPassword = await this.cryptoService.hashData(newPassword);
      await this.userRepo.updatePassword(decoded.id, hashedPassword);
      await this.userRepo.clearPasswordResetToken(decoded.id);
    } catch (error) {
      throw error;
    }
  }

  async execute(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const tokenPayload = await this.googleAuthService.verifyIdToken(token);
      if (!tokenPayload) throw new Error("Invalid token");

      const googleImageUrl = tokenPayload.picture as string;
      let cloudinaryImageUrl: string;
      try {
        cloudinaryImageUrl =
          await this.cloudinaryService.uploadGoogleProfileImage(googleImageUrl);
      } catch (error) {
        console.error("Failed to upload profile image:", error);
        cloudinaryImageUrl = googleImageUrl;
      }

      console.log(cloudinaryImageUrl, "cloudinaryImageUrl");

      const existingUser = await this.userRepo.findUserByEmail(
        tokenPayload.email as string
      );
      console.log(existingUser, "user in userUseCase");
      if (existingUser) {
        if (existingUser.isBlocked) {
          throw new Error("User is blocked. Please contact support."); //here i want to retuen the response into controller
        }
      }

      if (!existingUser) {
        const userData: IUser = {
          name: tokenPayload.name,
          email: tokenPayload.email,
          imageUrl: cloudinaryImageUrl,
          isVerified: true,
          isBlocked: false,
        } as unknown as IUser;
        console.log(userData, "userDataaaaaaaaaaaaaa");
        await this.userRepo.createGoogleUser(userData);
        console.log("New user created successfully");
      }
      const payload = { id: existingUser!._id, role: "user" };
      console.log(payload, "payload");
      const accessToken = this.jwtService.generateAccessToken(payload);
      const refreshToken = this.jwtService.generateRefreshToken(payload);

      console.log("Generated Tokens:", { accessToken, refreshToken });

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      return this.userRepo.getAllUsers();
    } catch (error) {
      throw error;
    }
  }

  async showProfile(userId: string): Promise<IProfile> {
    try {
      const user = await this.userRepo.findUserById(userId);
      // console.log(user,'qwertyuio');
      if (!user) {
        throw new Error('User not found');
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
      console.log(userProfile,"12345678901")
      return userProfile;
    } catch (error) {
      throw error;
    }
  }

  async updateProfileImage(image:string, userId: string):Promise<IUser | null>{
    try {
    
    const updatedUser = await this.userRepo.updateUserProfileImage(userId, image);
    if (!updatedUser) {
      throw new Error('User not found or update failed');
    }
    return updatedUser;
    } catch (error) {
      console.error('Error in updateProfileImage:', error);
      throw error;
    }
  }

  async updateProfile(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
        const { name, email, password } = updateData;

        if (email) {
            const existingUser = await this.userRepo.findByEmail(email);
            if (existingUser && existingUser._id.toString() !== userId) {
                throw new Error("Email already in use by another user");
            }
        }
        if (password) {
            const hashedPassword = await this.cryptoService.hashData(password);
            updateData.password = hashedPassword;
        }

        const updatedUser = await this.userRepo.updateUserProfile(userId, updateData);
        if (!updatedUser) {
            throw new Error("User not found or update failed");
        }

        return updatedUser;
    } catch (error) {
        throw error;
    }
}


  async isAuthenticated(
    token: string | undefined
  ): Promise<IsAuthenticatedUseCaseRES> {
    try {
      if (!token) {
        return { message: "Unauthorized: No token provided", status: 401 };
      }
      const decoded = this.jwtService.verifyAccessToken(token) as JWTPayload;
      console.log(decoded, "decodeeeeeeeeeeeeeeeeee");
      if (decoded.role?.toLowerCase() !== "user") {
        return { message: "No access user", status: 401 };
      }
      return { message: "User is Authenticated", status: 200 };
    } catch (error) {
      throw error;
    }
  }


}
