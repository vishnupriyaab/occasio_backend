import { ICryptoService } from "../interfaces/integration/ICrypto";
import * as crypto from "crypto";
import { compareOtp, hashOtp } from "./hashOtp";

export class CryptoService implements ICryptoService {
  generateOtp(): string {
    return crypto.randomInt(1000, 9999).toString();
  }

  async hashData(data: string): Promise<string> {
    return await hashOtp(data);
  }

  async compareData(data: string, hashedData: string): Promise<boolean> {
    return await compareOtp(data, hashedData);
  }
}
