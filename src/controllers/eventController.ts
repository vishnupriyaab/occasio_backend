import { Request, Response } from "express";
import { EventUseCase } from "../usecase/eventUseCase";
import { handleSuccess } from "../framework/utils/responseHandler";
import { CloudinaryService } from "../framework/utils/claudinaryService";

export class EventController {
  constructor(
    private eventUseCase: EventUseCase,
    private cloudinaryService: CloudinaryService
  ) {}
  async addEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventName, description } = req.body;
      console.log(eventName, description, "req.bodyyy");
      const file = req.file;
      console.log(file, "file in event Controller");

      if (!file) {
        res.status(400).json({ error: "No image file provided" });
        return;
      }

      const event = await this.eventUseCase.addEvent(
        { eventName, description },
        file
      );

      const response = handleSuccess(
        "User registerd Successfully!",
        201,
        event
      );
      res.status(response.statusCode).json(response);
      return;
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to create event",
      });
    }
  }

  async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await this.eventUseCase.getAllEvents();
      // console.log(events,"events in controller....")
      const response = handleSuccess(
        "Events fetched successfully",
        200,
        events
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to fetch events",
      });
    }
  }

  async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      console.log(id, "id");
      const { eventName, packageName, description } = req.body;
      console.log(eventName, packageName, description, "req.body");
      const file = req.file;

      const updatedData: any = { eventName, packageName, description };

      if (file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        updatedData.image = imageUrl;
      }

      const updatedEvent = await this.eventUseCase.updateEvent(id, updatedData);
      const response = handleSuccess(
        "Event updated successfully!",
        200,
        updatedEvent
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to update event",
      });
    }
  }
  async blockEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      console.log(eventId, "eventidddddddddddd");
      const result: any = await this.eventUseCase.blockEvent(eventId);

      const response = handleSuccess(
        `Event ${result.isBlocked ? "blocked" : "unblocked"} successfully`,
        200,
        result
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to block events",
      });
    }
  }

  async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      await this.eventUseCase.deleteEvent(eventId);

      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Event deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to delete events",
      });
    }
  }

  async addPackage(req: Request, res: Response) {
    try {
      const { packageName, startingAmnt, eventId } = req.body;
      const file = req.file;
      console.log(
        packageName,
        startingAmnt,
        eventId,
        "1111111111111",
        file,
        "req.bodyyyy"
      );

      if (!file) {
        res.status(400).json({ error: "No image file provided" });
        return;
      }
      const newPackage = await this.eventUseCase.addPackage(
        { packageName, startingAmnt, eventId },
        file
      );
      const response = handleSuccess(
        "Package created Successfully!",
        201,
        newPackage
      );
      res.status(response.statusCode).json(response);
      return;
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to create event",
      });
    }
  }
  async getPackages(req: Request, res: Response) {
    const eventId: string = req.params.id;
    try {
      console.log(eventId, "eventId");
      const packages = await this.eventUseCase.getAllPackages(eventId);
      const response = handleSuccess(
        "Events fetched successfully",
        200,
        packages
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to fetch packages",
      });
    }
  }

  async updatePackage(req: Request, res: Response): Promise<void> {
    try {
      const packageId = req.params.id;
      console.log(packageId, "packageId");
      const { packageName, startingAmnt, eventId } = req.body;
      console.log(packageName, startingAmnt, eventId, "req.bodyyyyyy");
      const file = req.file;
      const updatedData: any = { packageName, startingAmnt, eventId };
      if(file){
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        updatedData.image = imageUrl;
      }
      const updatedPackage = await this.eventUseCase.updatedPackage(packageId,updatedData);
      const response = handleSuccess(
        "Package updated successfully!",
        200,
        updatedPackage
      )
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to update package",
      });
    }
  }

  async deletePackage(req:Request,res:Response):Promise<void>{
    try {
      const packageId = req.params.id;
      console.log(packageId,"packageId");
      await this.eventUseCase.deletePackage(packageId);
      res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Package deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to delete packages",
      });
    }
  }
  async blockPackage(req:Request,res:Response):Promise<void>{
    try {
      const packageId = req.params.id;
      console.log(packageId, "packageIddddddddddd");
      const result: any = await this.eventUseCase.blockPackage(packageId);

      const response = handleSuccess(
        `Package ${result.isBlocked ? "blocked" : "unblocked"} successfully`,
        200,
        result
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to block package",
      });
    }
  }
}
