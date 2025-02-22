export default interface IRefreshTokenService{
    getNewAccessTokenWithRefreshToken(
        refreshToken: string | undefined
      ): Promise<string | never>
}