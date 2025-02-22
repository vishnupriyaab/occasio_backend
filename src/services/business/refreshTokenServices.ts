import { JWTService } from "../../integration/jwtServices";
import { IJWTService, JWTPayload } from "../../interfaces/integration/IJwt";
import IRefreshTokenService from "../../interfaces/services/refresh.services";

export class RefreshTokenServices implements IRefreshTokenService {
  private _jwtService: IJWTService;
  constructor(jwtService: IJWTService) {
    this._jwtService = jwtService;
  }

    async getNewAccessTokenWithRefreshToken(
      refreshToken: string | undefined
    ): Promise<string | never> {
      try {
        if (!refreshToken) {
          const error = new Error('Not Authenticated.No refreshToken');
          error.name = 'NotAuthenticated'
          throw error;
        }
        try {
            const decode = this._jwtService.verifyRefreshToken(refreshToken);
            console.log(decode, "123456789");
            const payload: JWTPayload = {
              id: decode.id,
              role: decode.role,
            };
            const accessToken = this._jwtService.generateAccessToken(payload);
            return accessToken;
        } catch (error:unknown) {
          if(error instanceof Error){
            if(error.name === 'NotAuthenticated'){
              throw error;
            }
          }
          throw new Error("refreshToken expired");
        }
      } catch (error:unknown) {
        throw error;
      }
    }

}

const IjwtService: IJWTService = new JWTService();
export const refreshTokenServices = new RefreshTokenServices(IjwtService);
