import { IAddEventRegister, IEvent } from "../entities/event.entity";
import { IPackage, IPackageRegister } from "../entities/package.entity";
import { ICloudinaryService } from "../interfaces/IClaudinary";
import { EventRepository } from "../repositories/eventRepository";

export class EventUseCase {
  constructor(
    private cloudinaryService: ICloudinaryService,
    private eventRepo: EventRepository
  ) {}

  async addEvent(eventData: any, file: Express.Multer.File) {
    console.log(eventData, file, "datas in eventUseCaseee");

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
      console.log(imageUrl, "imageUrl");

      const event: IAddEventRegister = {
        ...eventData,
        image: imageUrl,
      };

      console.log(event, "event of useCase");
      const newEvent = await this.eventRepo.addEvent(event);

      return newEvent;
    } catch (error) {
      throw new Error("Failed to create event");
    }
  }

  async getAllEvents(): Promise<IEvent[]> {
    return this.eventRepo.getAllEvents();
  }

  async updateEvent(id: string, updatedData: any): Promise<IEvent | null> {
    return this.eventRepo.updateEvent(id, updatedData);
  }
  async blockEvent(eventId: string): Promise<IEvent | null> {
    const event = await this.eventRepo.findByEventId(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    event.isBlocked = !event.isBlocked;
    return await this.eventRepo.updateEvent(eventId, {
      isBlocked: event.isBlocked,
    });
  }

  async deleteEvent(eventId: string) {
    const event = await this.eventRepo.findByEventId(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    return await this.eventRepo.deleteEvent(eventId);
  }
  async addPackage(packageData: any, file: Express.Multer.File) {
    console.log(packageData, file, "data in useCase");
    try {
      const existingPackage = await this.eventRepo.findByPackageName(
        packageData.packageName
      );
      if (existingPackage) {
        throw new Error(
          `Event with name "${existingPackage.packageName}" already exists.`
        );
      }
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      console.log(imageUrl, "imageUrl");

      const newPackage: IPackageRegister = {
        ...packageData,
        isBlocked: false,
        isActive: true,
        image: imageUrl,
      };

      console.log(newPackage, "event of useCase");
      const setNewPackage = await this.eventRepo.addPackage(newPackage);
      return setNewPackage;
    } catch (error) {
      throw new Error("Failed to create event");
    }
  }

  async getAllPackages(eventId: string): Promise<IPackage[]> {
    try {
      return this.eventRepo.getAllPackages(eventId);
    } catch (error) {
      throw new Error("Failed to fetch packges");
    }
  }
  async updatedPackage(
    packageId: string,
    updatedData: any
  ): Promise<IPackage | null> {
    try {
      const eventId = updatedData.eventId;
      console.log(eventId, "eventid1234567");

      const existingPackage = await this.eventRepo.getPackageById(
        packageId,
        eventId
      );
      console.log(existingPackage, "qwertyuiop");

      if (!existingPackage) {
        throw new Error("Package not found for this event");
      } else {
        const updatedPackage = await this.eventRepo.updatedPackage(
          packageId,
          updatedData
        );
        console.log("Package successfully updated");
        return updatedPackage;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to update package");
    }
  }
  async deletePackage(packageId:string){
    const packagee = await this.eventRepo.findByPackageId(packageId);
    if(!packagee){
      throw new Error("Package not found");
    }
    return await this.eventRepo.deletePackage(packageId);
  }

  async blockPackage(packageId: string): Promise<IPackage | null> {
    const packagee = await this.eventRepo.findByPackageId(packageId);
    if (!packagee) {
      throw new Error("Event not found");
    }

    packagee.isBlocked = !packagee.isBlocked;
    return await this.eventRepo.updatedPackage(packageId, {
      isBlocked: packagee.isBlocked,
    });
  }
}
