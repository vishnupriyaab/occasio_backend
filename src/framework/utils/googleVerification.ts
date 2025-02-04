import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";
import { IGoogleAuthService } from "../../interfaces/utils/IGoogleVerification";

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
      if (!payload) throw new Error("Invalid ID token payload");
      return payload;
    } catch (error) {
      console.error("Error verifying ID token:", error);
      throw new Error("Invalid ID token");
    }
  }
}
