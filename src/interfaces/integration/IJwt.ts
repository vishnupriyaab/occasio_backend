export interface JWTPayload {
  id: string; 
  role:string; 
}

export interface TokenConfig {
  secret: string;
  expiresIn: string;
}


export interface IJWTService {
  generateAccessToken(payload: JWTPayload): string;
  generateRefreshToken(payload: JWTPayload): string;
  verifyAccessToken(token: string): JWTPayload;
  verifyRefreshToken(token: string): JWTPayload;
  decodeToken(token: string): JWTPayload | null;
}