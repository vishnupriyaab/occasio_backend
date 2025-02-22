// services/JWTService.ts
import jwt from "jsonwebtoken";
import { IJWTService, JWTPayload } from "../interfaces/integration/IJwt";

export class JWTService implements IJWTService {
  private readonly _accessTokenSecret: string;
  private readonly _refreshTokenSecret: string;
  private readonly _accessTokenExpiry: string;
  private readonly _refreshTokenExpiry: string;

  constructor() {
    this._accessTokenSecret = process.env.JWT_SECRET || "accessSecretKey";
    this._refreshTokenSecret =
      process.env.JWT_REFRESH_SECRET || "refreshSecretKey";
    this._accessTokenExpiry = "1d";
    this._refreshTokenExpiry = "30d";
  }

  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this._accessTokenSecret, {
      expiresIn: this._accessTokenExpiry,
    });
  }

  generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, this._refreshTokenSecret, {
      expiresIn: this._refreshTokenExpiry,
    });
  }

  verifyAccessToken(token: string): JWTPayload {
    try {
      console.log(token,"1234567890", this._accessTokenSecret);
      return jwt.verify(token, this._accessTokenSecret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid or expired access token");
      }
      throw error;
    }
  }

  verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this._refreshTokenSecret) as JWTPayload;
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
