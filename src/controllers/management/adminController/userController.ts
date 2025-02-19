import { AuthenticatedRequest } from "../../../framework/middlewares/authenticateToken";
import IUserController from "../../../interfaces/controller/admin/user.controller";

export class UserController implements IUserController{

    constructor(private userService: ){}

      //blockUser
  async blockUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      console.log(userId, "qwertyu");

      const result: any = await this.adminUseCase.blockUser(userId);
      const response = result.isBlocked
        ? ResponseMessage.USER_BLOCKED
        : ResponseMessage.USER_UNBLOCKED;
      res
        .status(HttpStatusCode.OK)
        .json(handleSuccess(response, HttpStatusCode.OK, result));
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json(
          handleError(
            ResponseMessage.BLOCK_USER_FAILURE,
            HttpStatusCode.INTERNAL_SERVER_ERROR
          )
        );
    }
  }
}