import { IsAuthenticatedUseCaseRES } from "../../common/IIsAuthenticated";

export default interface IAdminAuthServices {
  adminLogin( email: string, password: string ): Promise<{ accessToken: string; refreshToken: string }>;
  isAuthenticated( token: string | undefined ): Promise<IsAuthenticatedUseCaseRES>
}
