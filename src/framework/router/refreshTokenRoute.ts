import express from "express";
import { IJWTService } from "../../interfaces/utils/IJwt";
import { JWTService } from "../utils/jwtServices";
import IRefreshTokenUseCase from "../../interfaces/useCase/refreshToken.useCase";
import { RefreshTokenUsecase } from "../../usecase/refreshTokenUseCase";
import { IRefreshTokenController } from "../../interfaces/controller/refreshToken.controller";
import { RefreshTokenController } from "../../controllers/refreshTokenController";

const refreshTokenRoute = express.Router();

const iJwtServices:IJWTService = new JWTService();
const refreshTokenUseCase: IRefreshTokenUseCase = new RefreshTokenUsecase(iJwtServices);
const refreshTokenController: IRefreshTokenController = new RefreshTokenController(refreshTokenUseCase);

refreshTokenRoute.post('/',refreshTokenController.getNewAccessTokenWithRefreshToken.bind(refreshTokenController))

export default refreshTokenRoute;