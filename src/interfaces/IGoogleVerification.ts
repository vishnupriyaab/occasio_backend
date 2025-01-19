import { TokenPayload } from "google-auth-library";

export interface IGoogleAuthService{
    verifyIdToken(idToken: string): Promise<TokenPayload>
}