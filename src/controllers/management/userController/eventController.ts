import { Request, Response } from "express";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import IUserEventService from "../../../interfaces/services/user/event.services";
import { userEventService } from "../../../services/business/userServices/eventService";

export class UserEventController {
  private eventService: IUserEventService;
  constructor(eventService: IUserEventService) {
    this.eventService = eventService;
  }

  //getEvent
  async getEvent(req: Request, res: Response): Promise<void> {
    try {
      const events = await this.eventService.getEvents();
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Events fetched successfully",
        events
      );
    } catch (error: unknown) {
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }
}

export const userEventController = new UserEventController(userEventService);
