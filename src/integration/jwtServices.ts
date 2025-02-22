// services/JWTService.ts
import jwt from "jsonwebtoken";
import { IJWTService, JWTPayload } from "../interfaces/integration/IJwt";

export class JWTService implements IJWTService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || "accessSecretKey";
    this.refreshTokenSecret =
      process.env.JWT_REFRESH_SECRET || "refreshSecretKey";
    this.accessTokenExpiry = "1d";
    this.refreshTokenExpiry = "30d";
  }

  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    });
  }

  verifyAccessToken(token: string): JWTPayload {
    try {
      console.log(token,"1234567890", this.accessTokenSecret);
      return jwt.verify(token, this.accessTokenSecret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid or expired access token");
      }
      throw error;
    }
  }

  verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.refreshTokenSecret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid or expired refresh token");
      }
      throw error;
    }
  }
  decodeToken(token: string): JWTPayload | null {
    console.log('Decoded Token:', token);
    const decoded = jwt.decode(token) as JWTPayload | null;
    return decoded ?? null;
 }
 
}
