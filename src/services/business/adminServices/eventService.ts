import { IAddEventRegister, IEvent } from "../../../entities/event.entity";
import { CloudinaryService } from "../../../integration/claudinaryService";
import { ICloudinaryService } from "../../../interfaces/integration/IClaudinary";
import IAdminEventRepository from "../../../interfaces/repository/admin/event.repository";
import IAdminEventService from "../../../interfaces/services/admin/event.services";
import { AdminEventRepository } from "../../../repositories/entities/adminRepositories/eventRepository";

export class AdminEventService implements IAdminEventService {
  private eventRepo: IAdminEventRepository;
  private cloudinaryService: ICloudinaryService;
  constructor(
    eventRepo: IAdminEventRepository,
    cloudinaryService: ICloudinaryService
  ) {
    this.eventRepo = eventRepo;
    this.cloudinaryService = cloudinaryService;
  }

  //addEvents
  async addEvent(eventData: any, file: Express.Multer.File): Promise<any> {
    try {
      const normalizedEventName = eventData.eventName.toLowerCase();

      const existingEvent = await this.eventRepo.findByEventName(
        normalizedEventName
      );

      if (existingEvent) {
        const error = new Error(
          `Event with name "${eventData.eventName}" already exists.`
        );
        error.name = "EventAlreadyExists";
        throw error;
      }

      const imageUrl = await this.cloudinaryService.uploadImage(file);
      console.log(imageUrl, "imageUrl");

      const event: IAddEventRegister = {
        ...eventData,
        image: imageUrl,
      };

      console.log(event, "event of useCase");
      const newEvent = await this.eventRepo.addEvent(event);

      return newEvent;
    } catch (error: unknown) {
      throw error;
    }
  }

  //Fetch- S,F,P
  async searchEvent(
    searchTerm: string,
    filterStatus: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    events: IEvent[];
    totalEvents: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      if (page < 1 || limit < 1) {
        const error = new Error("Invalid Page Or Limit");
        error.name = "InvalidPageOrLimit";
        throw error;
      }
      return await this.eventRepo.searchEvent(
        searchTerm,
        filterStatus,
        page,
        limit
      );
    } catch (error: unknown) {
      throw error;
    }
  }

  //updateEvent
  async updateEvent(
    id: string,
    updatedData: any,
    file?: Express.Multer.File
  ): Promise<IEvent | undefined | null> {
    try {
      if (file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        updatedData.image = imageUrl;
      }

      const updatedEvent = await this.eventRepo.updateEvent(id, updatedData);
      return updatedEvent;
    } catch (error: unknown) {
      throw error;
    }
  }

  //blockEvent
  async blockEvent(eventId: string): Promise<IEvent | null> {
    try {
      const event = await this.eventRepo.findByEventId(eventId);
      if (!event) {
        const error = new Error('Event not found');
        error.name = 'EventNotFound'
        throw error;
      }

      event.isBlocked = !event.isBlocked;
      return await this.eventRepo.updateEvent(eventId, {
        isBlocked: event.isBlocked,
      });
    } catch (error: unknown) {
      throw error;
    }
  }

  //DeleteEvent
  async deleteEvent(eventId: string): Promise<void> {
    try {
      const event = await this.eventRepo.findByEventId(eventId);
      if (!event) {
        const error = new Error('Event not found');
        error.name = 'EventNotFound'
        throw error;
      }

      await this.eventRepo.deleteEvent(eventId);
      return;
    } catch (error:unknown) {
      throw error;
    }
  }
}

const cloudinaryService = new CloudinaryService();
const adminEventRepository = new AdminEventRepository();
export const adminEventService = new AdminEventService(
  adminEventRepository,
  cloudinaryService
);
