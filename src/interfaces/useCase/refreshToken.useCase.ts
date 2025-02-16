export default interface IRefreshTokenUseCase {
  getNewAccessTokenWithRefreshToken(
    refreshToken: string | undefined
  ): Promise<string | never>;
}
