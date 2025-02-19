import { IsAuthenticatedUseCaseRES } from "../../common/IIsAuthenticated";

export default interface IAdminServices {
  adminLogin( email: string, password: string ): Promise<{ accessToken: string; refreshToken: string }>;
  isAuthenticated( token: string | undefined ): Promise<IsAuthenticatedUseCaseRES>
}
