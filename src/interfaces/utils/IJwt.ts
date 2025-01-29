export interface JWTPayload {
  userId?: string;
  adminId?:string;
  employeeId?:string;
  iat?: number;
  exp?: number;
  role?:string;
  email?:string;
  name?:string;
  picture?:string
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