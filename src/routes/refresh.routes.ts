import { Router } from "express";
import { refreshTokenController } from "../controllers/management/refreshTokenController";

const refreshTokenRoute = Router();


refreshTokenRoute.post('/',refreshTokenController.getNewAccessTokenWithRefreshToken.bind(refreshTokenController))

export default refreshTokenRoute;