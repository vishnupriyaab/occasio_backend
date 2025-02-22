import { otpResponse } from "../../../interfaces/entities/otp.entity";
import { IRegisterUser, IUser } from "../../../interfaces/entities/user.entity";
import { CloudinaryService } from "../../../integration/claudinaryService";
import { CryptoService } from "../../../integration/cryptoServices";
import { EmailService } from "../../../integration/emailService";
import { GoogleAuthService } from "../../../integration/googleVerification";
import { JWTService } from "../../../integration/jwtServices";
import { IsAuthenticatedUseCaseRES } from "../../../interfaces/common/IIsAuthenticated";
import { ICloudinaryService } from "../../../interfaces/integration/IClaudinary";
import { ICryptoService } from "../../../interfaces/integration/ICrypto";
import { IEmailService } from "../../../interfaces/integration/IEmail";
import { IGoogleAuthService } from "../../../interfaces/integration/IGoogleVerification";
import { IJWTService, JWTPayload } from "../../../interfaces/integration/IJwt";
import IOtpRepository from "../../../interfaces/repository/otp.Repository";
import IUserAuthRepository from "../../../interfaces/repository/user/auth.repository";
import IUserAuthService from "../../../interfaces/services/user/auth.services";
import { UserAuthRepository } from "../../../repositories/entities/userRepositories/authRepository";
import { OtpRepository } from "../../../repositories/entities/otpRepository";
import bcrypt from "bcrypt";

export class UserAuthService implements IUserAuthService{
  private _authRepo: IUserAuthRepository;
  private _cryptoService: ICryptoService;
  private _jwtService: IJWTService;
  private _emailService: IEmailService;
  private _otpRepo: IOtpRepository;
  private _googleAuthService: IGoogleAuthService;
  private _cloudinaryService: ICloudinaryService;
  constructor(
    authRepo: IUserAuthRepository,
    otpRepo: IOtpRepository,
    emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    },
    jwtService: IJWTService,
    cryptoService: ICryptoService,
    googleAuthService: IGoogleAuthService,
    cloudinaryService: ICloudinaryService
  ) {
    this._authRepo = authRepo;
    this._emailService = new EmailService(emailConfig);
    this._cryptoService = cryptoService;
    this._jwtService = jwtService;
    this._otpRepo = otpRepo;
    this._googleAuthService = googleAuthService;
    this._cloudinaryService = cloudinaryService
  }

  async registerUser(user: IRegisterUser): Promise<IRegisterUser | null> {
    try {
      const existingUser = await this._authRepo.findUserByEmail(user.email);
      if (existingUser) {
        const error = new Error("User already exists");
        error.name = "UserAlreadyExists";
        throw error;
      }

      const hashedPassword = await this._cryptoService.hashData(user.password);
      user.password = hashedPassword;
      const newUser = await this._authRepo.createUser(user);

      const otp = this._cryptoService.generateOtp();
      console.log(otp, "otp..........!");
      const hashedOtp = await this._cryptoService.hashData(otp);
      await this._otpRepo.createOtp(String(newUser.email), hashedOtp);

      await this._emailService.sendOtpEmail(user.email, otp);

      return newUser;
    } catch (error: unknown) {
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<otpResponse> {
    try {
      const otpRecord = await this._otpRepo.findOtp(email);
      if (!otpRecord) {
        const error = new Error("OTP not found or has expired");
        error.name = "OTPNotFoundOrHasExpired";
        throw error;
      }

      const verified = await this._cryptoService.compareData(otp, otpRecord.otp);
      if (verified) {
        const updatedUser = await this._authRepo.updateActivatedStatus(
          email,
          true
        );

        console.log(updatedUser, "updatedUser");
        await this._otpRepo.deleteOtp(email);
        return{
            success: true,
            message: 'Verify Otp',
            user: updatedUser
        }
      } else {
        const error = new Error("Invalid OTP");
        error.name = "InvalidOTP";
        throw error;
      }
    } catch (error: unknown) {
      throw error;
    }
  }

  async resendOtp(email: string): Promise<otpResponse> {
    try {
      const existingUser = await this._authRepo.findUserByEmail(email);
      if (!existingUser) {
        const error = new Error("User not found");
        error.name = "UserNotFound";
        throw error;
      }

      await this._otpRepo.deleteOtp(email);

      const otp = this._cryptoService.generateOtp();
      console.log(otp, "new otp generated");
      const hashedOtp = await this._cryptoService.hashData(otp);

      await this._otpRepo.createOtp(email, hashedOtp);

      await this._emailService.sendOtpEmail(email, otp);
      return {
        success: true,
        message: 'Resend OTP',
        user: existingUser
      }
    } catch (error: unknown) {
      throw error;
    }
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this._authRepo.findUserByEmail(email);
      await this._authRepo.updateActivatedStatus(email, true);

      if (!user) {
        const error = new Error("User not found");
        error.name = "UserNotFound";
        throw error;
      }

      if (!user.isVerified) {
        const error = new Error(
          "Account not verified. Please verify your account"
        );
        error.name = "AcntNotVerified";
        throw error;
      }

      if (user.isBlocked) {
        const error = new Error("Your account is blocked");
        error.name = "AccountIsBlocked";
        throw error;
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password as string
      );
      if (!isPasswordValid) {
        const error = new Error("Invalid password");
        error.name = "InvalidPassword";
        throw error;
      }
      const payload = { id: user._id, role: "user" };
      const accessToken = this._jwtService.generateAccessToken(payload);
      const refreshToken = this._jwtService.generateRefreshToken(payload);
      return { accessToken, refreshToken };
    } catch (error: unknown) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this._authRepo.findUserByEmail(email);
      if (!user) {
        const error = new Error("User not found!");
        error.name = "UserNotFound";
        throw error;
      }
      const token = this._jwtService.generateAccessToken({
        id: user._id,
        role: "user",
      });
      await this._authRepo.savePasswordResetToken(user._id as string, token);
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await this._emailService.sendPasswordResetEmail(email, resetLink);
    } catch (error: unknown) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = this._jwtService.verifyAccessToken(token);

      if (!decoded.id) {
        const error = new Error("Invalid reset token");
        error.name = "InvalidResetToken";
        throw error;
      }

      const user = await this._authRepo.findUserById(decoded.id);
      if (!user) {
        const error = new Error("User not found");
        error.name = "UserNotFound";
        throw error;
      }

      const storedToken = await this._authRepo.getPasswordResetToken(decoded.id);
      if (!storedToken || storedToken !== token) {
        const error = new Error("Invalid or expired reset token");
        error.name = "InvalidOrExpiredResetToken";
        throw error;
      }

      const hashedPassword = await this._cryptoService.hashData(newPassword);
      await this._authRepo.updatePassword(decoded.id, hashedPassword);
      await this._authRepo.clearPasswordResetToken(decoded.id);
    } catch (error: unknown) {
      throw error;
    }
  }

  async googleLogin(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      console.log(token,"qwertyuiop")
      const tokenPayload = await this._googleAuthService.verifyIdToken(token);
      if (!tokenPayload){
        const error = new Error('Invalid token');
        error.name = 'InvalidToken'
        throw error;
      } 

      const googleImageUrl = tokenPayload.picture as string;
      let cloudinaryImageUrl: string;
      try {
        cloudinaryImageUrl =
          await this._cloudinaryService.uploadGoogleProfileImage(googleImageUrl);
      } catch (error) {
        console.error("Failed to upload profile image:", error);
        cloudinaryImageUrl = googleImageUrl;
      }

      console.log(cloudinaryImageUrl, "cloudinaryImageUrl");

      const existingUser = await this._authRepo.findUserByEmail(
        tokenPayload.email as string
      );
      console.log(existingUser, "user in userUseCase");
      if (existingUser) {
        if (existingUser.isBlocked) {
            const error = new Error('User is blocked. Please contact support')
            error.name = 'UserIsBlocked'
            throw error;
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
        await this._authRepo.createGoogleUser(userData);
        console.log("New user created successfully");
      }
      const payload = { id: existingUser!._id, role: "user" };
      console.log(payload, "payload");
      const accessToken = this._jwtService.generateAccessToken(payload);
      const refreshToken = this._jwtService.generateRefreshToken(payload);

      console.log("Generated Tokens:", { accessToken, refreshToken });

      return { accessToken, refreshToken };
    } catch (error: unknown) {
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
        const decoded = this._jwtService.verifyAccessToken(token) as JWTPayload;
        console.log(decoded, "decodeeeeeeeeeeeeeeeeee");
        if (decoded.role?.toLowerCase() !== "user") {
          return { message: "No access user", status: 401 };
        }
        return { message: "User is Authenticated", status: 200 };
      } catch (error: unknown) {
        throw error;
      }
    }
  

}

const userAuthRepository = new UserAuthRepository();
const otpRepository: IOtpRepository = new OtpRepository();
const IjwtService: IJWTService = new JWTService();
const cryptoService: ICryptoService = new CryptoService();
const cloudinaryService: ICloudinaryService = new CloudinaryService()

if (!process.env.GOOGLE_AUTH_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID environment variable is required");
}
const googleAuthService: IGoogleAuthService = new GoogleAuthService(
  process.env.GOOGLE_AUTH_CLIENT_ID
);

const emailConfig = {
  user: process.env.EMAIL_COMPANY, //user: string | undefined;
  pass: process.env.EMAIL_PASS, //pass: string | undefined;
  frontendUrl: process.env.FRONTEND_URL, //frontendUrl: string | undefined;
};

export const userAuthService = new UserAuthService(
  userAuthRepository,
  otpRepository,
  emailConfig,
  IjwtService,
  cryptoService,
  googleAuthService,
  cloudinaryService
);
