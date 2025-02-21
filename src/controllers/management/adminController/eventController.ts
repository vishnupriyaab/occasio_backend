import { Request, Response } from "express";
import IAdminEventService from "../../../interfaces/services/admin/event.services";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { adminEventService } from "../../../services/business/adminServices/eventService";

export class AdminEventController {
  private eventService: IAdminEventService;
  constructor(eventService: IAdminEventService) {
    this.eventService = eventService;
  }

  //addEvent
  async addEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventName, description } = req.body;
      console.log(eventName, description, "req.bodyyy");
      const file = req.file;
      console.log(file, "file in event Controller");

      if (!file) {
        const error = new Error("No image file provided");
        error.name = "NoImageFile";
        throw error;
      }

      const event = await this.eventService.addEvent(
        { eventName, description },
        file
      );
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Event successfully created",
        event
      );
    } catch (error: unknown) {
      console.log("Error occured: ", error);
      if (error instanceof Error) {
        if (error.name === "NoImageFile") {
          ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "No image file provided"
          );
          return;
        }
        if (error.name === "EventAlreadyExists") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Event  already exists");
          return;
        }
      }
      ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
      return;
    }
  }

  //Search Event
  async searchEvent(req: Request, res: Response): Promise<void> {
    try {
      const searchTerm = (req.query.searchTerm as string | undefined) || "";
      const filterStatus = req.query.filterStatus as string | undefined;

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;

      const result = await this.eventService.searchEvent(
        searchTerm,
        filterStatus,
        page,
        limit
      );
      console.log(result, "qwertyui");

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Events fetched successfully",
        result
      );
    } catch (error) {
      console.error("Search Event Error:", error);
      if (error instanceof Error) {
        if (error.name === "InvalidPageOrLimit") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Invalid page or limit");
          return;
        }
      }
      ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
      return;
    }
  }

  //updateEvent
  async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      console.log(id, "id");
      const { eventName, packageName, description } = req.body;
      console.log(eventName, packageName, description, "req.body");
      const file = req.file;

      const updatedData: any = { eventName, packageName, description };

      if (!file) {
        const error = new Error("Image is required");
        error.name = "ImageIsRequired";
        throw error;
      }
      //   if (file) {
      //     const imageUrl = await this.cloudinaryService.uploadImage(file);
      //     updatedData.image = imageUrl;
      //   }
      const updatedEvent = await this.eventService.updateEvent(
        id,
        updatedData,
        file
      );
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Event successfully updated",
        updatedEvent
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "ImageIsRequired") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Image is required");
          return;
        }
      }
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }

  //blockEvent
  async blockEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      console.log(eventId, "eventid");
      const result: any = await this.eventService.blockEvent(eventId);

      const response = result.isBlocked
        ? "Event blocked successfully"
        : "Event unblocked successfully";

      return successResponse(res, HttpStatusCode.OK, response, result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "EventNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Event not found");
          return;
        }
      }
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }

  //deleteEvent
  async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      await this.eventService.deleteEvent(eventId);

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Event successfully deleted"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "EventNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Event not found");
          return;
        }
      }
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  }
}

export const adminEventController = new AdminEventController(adminEventService);
