import { IAddEventRegister, IEvent } from "../entities/event.entity";
import { ICloudinaryService } from "../interfaces/IClaudinary";
import { EventRepository } from "../repositories/eventRepository";

export class EventUseCase {
  constructor(
    private cloudinaryService: ICloudinaryService,
    private eventRepo: EventRepository
  ) {}

  async addEvent(eventData: any, file: Express.Multer.File) {
    // console.log(eventData, file, "datas in eventUseCaseee");

    try {
      const existingEvent = await this.eventRepo.findByEventName(
        eventData.eventName
      );
      if (existingEvent) {
        throw new Error(
          `Event with name "${eventData.eventName}" already exists.`
        );
      }

      const imageUrl = await this.cloudinaryService.uploadImage(file);
    //   console.log(imageUrl, "imageUrl");

      const event: IAddEventRegister = {
        ...eventData,
        image: imageUrl,
      };

    //   console.log(event, "event of useCase");
      const newEvent = await this.eventRepo.addEvent(event);

      return newEvent;
    } catch (error) {
      throw new Error("Failed to create event");
    }
  }

  async getAllEvents() {
    return this.eventRepo.getAllEvents();
  }
  
  async updateEvent(id: string, updatedData: any):Promise<IEvent | null> {
    return this.eventRepo.updateEvent(id, updatedData);
  }
  async blockEvent(eventId:string):Promise<IEvent | null> {
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    event.isBlocked = !event.isBlocked;
    return await this.eventRepo.update(eventId, { isBlocked: event.isBlocked });
  }
  
  async deleteEvent(eventId:string) {
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    return await this.eventRepo.delete(eventId);
  }
}
