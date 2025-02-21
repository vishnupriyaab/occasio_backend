import { Router } from "express";
import { userEventController } from "../controllers/management/userController/eventController";

const userRouter = Router();

userRouter.get('/getEvent', userEventController.getEvent.bind(userEventController))

export default userRouter;