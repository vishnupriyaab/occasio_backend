import { IAddEventRegister, IEvent } from "../entities/event.entity";
import { IPackage, IPackageRegister } from "../entities/package.entity";
import { ICloudinaryService } from "../interfaces/utils/IClaudinary";
import { IEventRepository } from "../interfaces/IEvent";
import { EventRepository } from "../repositories/eventRepository";

export class EventUseCase {
  constructor(
    private cloudinaryService: ICloudinaryService,
    private eventRepo: IEventRepository
  ) {}

  async addEvent(eventData: any, file: Express.Multer.File):Promise<any> {
    try {
      const normalizedEventName = eventData.eventName.toLowerCase();

      const existingEvent = await this.eventRepo.findByEventName(
        normalizedEventName
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
      throw error;
    }
  }

  async getAllEvents(): Promise<IEvent[] | undefined> {
    try {
      return this.eventRepo.getAllEvents();
    } catch (error) {
      throw error;
    }
  }

  async updateEvent(id: string, updatedData: any): Promise<IEvent | undefined | null> {
    try {
      return this.eventRepo.updateEvent(id, updatedData);
    } catch (error) {
      throw error;
    }
  }

  async blockEvent(eventId: string): Promise<IEvent | null> {
    try {
      const event = await this.eventRepo.findByEventId(eventId);
      if (!event) {
        throw new Error("Event not found");
      }
  
      event.isBlocked = !event.isBlocked;
      return await this.eventRepo.updateEvent(eventId, {
        isBlocked: event.isBlocked,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteEvent(eventId: string):Promise<void> {
    try {
      const event = await this.eventRepo.findByEventId(eventId);
      if (!event) {
        throw new Error("Event not found");
      }
  
       await this.eventRepo.deleteEvent(eventId);
       return
    } catch (error) {
      throw error
    }
  }

  async addPackage(packageData: any, file: Express.Multer.File):Promise<any> {
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
        // isActive: true,
        image: imageUrl,
      };

      console.log(newPackage, "event of useCase");
      const setNewPackage = await this.eventRepo.addPackage(newPackage);
      return setNewPackage;
    } catch (error) {
      throw error;
    }
  }

  async getAllPackages(eventId: string): Promise<IPackage[]> {
    try {
      return this.eventRepo.getAllPackages(eventId);
    } catch (error) {
      throw error
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
      throw error;
    }
  }
  
  async deletePackage(packageId:string):Promise<void>{
    try {
      const packagee = await this.eventRepo.findByPackageId(packageId);
      if(!packagee){
        throw new Error("Package not found");
      }
       await this.eventRepo.deletePackage(packageId);
       return
    } catch (error) {
      throw error;
    }
  }

  async blockPackage(packageId: string): Promise<IPackage | null> {
    try {

      const packagee = await this.eventRepo.findByPackageId(packageId);
      if (!packagee) {
        throw new Error("Event not found");
      }
      packagee.isBlocked = !packagee.isBlocked;
      return await this.eventRepo.updatedPackage(packageId, {
        isBlocked: packagee.isBlocked,
      });

    } catch (error) {
      throw error;
    }
  }

  // async searchEvent(searchTerm:string, filterStatus:string | undefined, page:number, limit:number):Promise<any>{
  //   try {
  //     return await this.eventRepo.searchEvent(searchTerm, filterStatus, page, limit);
  //   } catch (error) {
  //     throw error;
  //   }
  // }


  async searchEvent(
    searchTerm: string, 
    filterStatus: string | undefined, 
    page: number, 
    limit: number
  ): Promise<{
    events: IEvent[], 
    totalEvents: number, 
    totalPages: number, 
    currentPage: number
  }> {
    try {
      // Any additional business logic can be added here
      // For example, input validation, authorization checks, etc.
      
      // Validate inputs
      if (page < 1) throw new Error('Page number must be positive');
      if (limit < 1) throw new Error('Limit must be positive');

      // Delegate to repository
      return await this.eventRepo.searchEvent(
        searchTerm, 
        filterStatus, 
        page, 
        limit
      );
    } catch (error) {
      // Transform or handle errors from repository
      throw new Error(`Use case search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
  

