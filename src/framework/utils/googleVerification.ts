import { LoginTicket, OAuth2Client, TokenPayload } from "google-auth-library";

const clientId = process.env.GOOGLE_AUTH_CLIENT_ID;

async function verifyGoogleIdToken(idToken: string): Promise<TokenPayload> {
    try {
        const client = new OAuth2Client(clientId);
        console.log(client,"clienttt")
        const ticket: LoginTicket = await client.verifyIdToken({ idToken, audience: clientId });
        console.log(ticket,"ticket");
        const payload: TokenPayload = ticket.getPayload() as TokenPayload;
        console.log(payload,"payload")
        return payload;
    } catch (error) {
        console.error(error);
        throw new Error('Invalid ID token');
    }
}

export default verifyGoogleIdToken;