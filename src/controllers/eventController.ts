import { Request, Response } from "express";
import { EventUseCase } from "../usecase/eventUseCase";
import { handleSuccess } from "../framework/utils/responseHandler";
import { CloudinaryService } from "../framework/utils/claudinaryService";
import { IEvent } from "../entities/event.entity";

export class EventController {
  constructor(private eventUseCase: EventUseCase, private cloudinaryService: CloudinaryService) {}
  async addEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventName, packageName, description } = req.body;
      console.log(eventName, packageName, description, "req.bodyyy");
      const file = req.file;
      console.log(file, "file in event Controller");
  
      if (!file) {
        res.status(400).json({ error: "No image file provided" });
        return;
      }
  
      const event = await this.eventUseCase.addEvent(
        { eventName, packageName, description },
        file
      );

      const response = handleSuccess("User registerd Successfully!", 201, event);
            res.status(response.statusCode).json(response);
            return;

    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to create event'
    });
    }
  }
  async getEvents(req:Request,res:Response):Promise<void>{
    try {
      const events = await this.eventUseCase.getAllEvents();
      // console.log(events,"events in controller....")
      const response = handleSuccess("Events fetched successfully", 200, events);
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to fetch events",
      });
    }
  }

  async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      console.log(id,"id")
      const {eventName, packageName, description } = req.body;
      console.log(eventName,packageName,description,"req.body")
      const file = req.file;
  
      const updatedData: any = { eventName, packageName, description };
  
      if (file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        updatedData.image = imageUrl;
      }
  
      const updatedEvent = await this.eventUseCase.updateEvent(id, updatedData);
      const response = handleSuccess('Event updated successfully!', 200, updatedEvent);
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to update event',
      });
    }
  }
  async blockEvent(req:Request,res:Response):Promise<void>{
    try {
      const  eventId  = req.params.id;
      console.log(eventId,"eventidddddddddddd")
      const result: any = await this.eventUseCase.blockEvent(eventId);
      
      const response = handleSuccess(`Event ${result.isBlocked ? 'blocked' : 'unblocked'} successfully`, 200, result);
      res.status(response.statusCode).json(response);

    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to block events",
      });
    }
  }

  async deleteEvent(req:Request,res:Response):Promise<void>{
    try {
      const eventId  = req.params.id;
      await this.eventUseCase.deleteEvent(eventId);
      
      res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Event deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to delete events",
      });
    }
  }
}