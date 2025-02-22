import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";
import { IGoogleAuthService } from "../interfaces/integration/IGoogleVerification";

export class GoogleAuthService implements IGoogleAuthService {
  private client: OAuth2Client;

  constructor(clientId: string) {
    this.client = new OAuth2Client(clientId);
  }

  async verifyIdToken(idToken: string): Promise<TokenPayload> {
    try {
      const ticket: LoginTicket = await this.client.verifyIdToken({
        idToken,
        audience: this.client._clientId,
      });
      const payload: TokenPayload = ticket.getPayload() as TokenPayload;
      if (!payload){
        const error = new Error('Invalid ID token payload')
        error.name = 'InvalidIDTokenPayload'
        throw error;
      } 
      return payload;
    } catch (error: unknown) {
      throw error;
    }
  }
}
