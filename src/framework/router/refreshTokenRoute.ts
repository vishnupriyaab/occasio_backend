import express from "express";
import { IJWTService } from "../../interfaces/integration/IJwt";
import { JWTService } from "../../integration/jwtServices";
import IRefreshTokenUseCase from "../../interfaces/useCase/refreshToken.useCase";
import { RefreshTokenUsecase } from "../../usecase/refreshTokenUseCase";
import { RefreshTokenController } from "../../controllers/refreshTokenController";

const refreshTokenRoute = express.Router();

const iJwtServices:IJWTService = new JWTService();
const refreshTokenUseCase: IRefreshTokenUseCase = new RefreshTokenUsecase(iJwtServices);
const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);

refreshTokenRoute.post('/',refreshTokenController.getNewAccessTokenWithRefreshToken.bind(refreshTokenController))

export default refreshTokenRoute;