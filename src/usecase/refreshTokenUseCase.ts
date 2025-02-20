import IRefreshTokenUseCase from "../interfaces/useCase/refreshToken.useCase";
import { IJWTService, JWTPayload } from "../interfaces/integration/IJwt";

export class RefreshTokenUsecase implements IRefreshTokenUseCase {
  private jwtService: IJWTService;
  constructor(jwtService: IJWTService) {
    this.jwtService = jwtService;
  }
  async getNewAccessTokenWithRefreshToken(
    refreshToken: string | undefined
  ): Promise<string | never> {
    try {
      if (!refreshToken) {
        throw new Error("Not Authenticated.No refreshToken");
      }
      try {
          const decode = this.jwtService.verifyRefreshToken(refreshToken);
          console.log(decode, "123456789");
          const payload: JWTPayload = {
            id: decode.id,
            role: decode.role,
          };
          const accessToken = this.jwtService.generateAccessToken(payload);
          return accessToken;
      } catch (error) {
        throw new Error("refreshToken expired");
      }
    } catch (error) {
      throw error;
    }
  }
}
