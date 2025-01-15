// src/infrastructure/auth/interfaces/ICryptoService.ts
export interface ICryptoService {
    generateOtp(): string;
    hashData(data: string): Promise<string>;
    compareData(data: string, hashedData: string): Promise<boolean>;
  }