import { IAddEventRegister, IEvent } from "../entities/event.entity";
import { IPackage, IPackageRegister } from "../entities/package.entity";
import IEventRepository from "../interfaces/repository/event.Repository";
import { ICloudinaryService } from "../interfaces/utils/IClaudinary";

export class EventUseCase {
  constructor(
    private cloudinaryService: ICloudinaryService,
    private eventRepo: IEventRepository
  ) {}

  async addEvent(eventData: any, file: Express.Multer.File): Promise<any> {
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

  async updateEvent(
    id: string,
    updatedData: any
  ): Promise<IEvent | undefined | null> {
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

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const event = await this.eventRepo.findByEventId(eventId);
      if (!event) {
        throw new Error("Event not found");
      }

      await this.eventRepo.deleteEvent(eventId);
      return;
    } catch (error) {
      throw error;
    }
  }

  async addPackage(packageData: any, file: Express.Multer.File): Promise<any> {
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

      const featuresName = packageData.items[0].name;
      // const featuresAmount = packageData.items[0].amount;
      console.log("features", featuresName);

      const newPackage: IPackageRegister = {
        packageName: packageData.packageName,
        startingAmnt: packageData.startingAmnt,
        eventId: packageData.eventId,
        items: packageData.items.map(
          (item: { name: string; amount: number; isBlocked: boolean }) => ({
            name: item.name,
            amount: Number(0),
            isBlocked: item.isBlocked || false,
          })
        ),
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
      throw error;
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

  async deletePackage(packageId: string): Promise<void> {
    try {
      const packagee = await this.eventRepo.findByPackageId(packageId);
      if (!packagee) {
        throw new Error("Package not found");
      }
      await this.eventRepo.deletePackage(packageId);
      return;
    } catch (error) {
      throw error;
    }
  }

  async blockPackage(packageId: string): Promise<IPackage | null> {
    try {
      const packagee = await this.eventRepo.findByPackageId(packageId);
      if (!packagee) {
        throw new Error("Package not found");
      }
      packagee.isBlocked = !packagee.isBlocked;
      return await this.eventRepo.updatedPackage(packageId, {
        isBlocked: packagee.isBlocked,
      });
    } catch (error) {
      throw error;
    }
  }

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
      if (page < 1) throw new Error("Page number must be positive");
      if (limit < 1) throw new Error("Limit must be positive");

      return await this.eventRepo.searchEvent(
        searchTerm,
        filterStatus,
        page,
        limit
      );
    } catch (error) {
      throw new Error(
        `Use case search failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getEvents():Promise<IEvent[]>{
    try {
      return this.eventRepo.getEvents();
    } catch (error) {
      throw error
    }
  }

  async searchFeature(
    packageId: string,
    searchTerm: string,
    filterStatus: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    // packageDetails: {
    packageName: string;
    // image: string;
    // startingAmnt: number;
    // };
    features: Array<{
      name: string;
      isBlocked: boolean;
      amount: number;
    }>;
    totalFeatures: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      if (page < 1) throw new Error("Page number must be positive");
      if (limit < 1) throw new Error("Limit must be positive");

      return await this.eventRepo.searchFeatures(
        packageId,
        searchTerm,
        filterStatus,
        page,
        limit
      );
    } catch (error) {
      throw new Error(
        `Use case search failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async blockFeature(packageId: string, featureId: string): Promise<IPackage | null> {
    try {
      console.log(packageId, featureId);

      const existingPackage = await this.eventRepo.findById(packageId);
      if (!existingPackage) {
        throw new Error("Package not found");
      }

      console.log(existingPackage, "yuio");

      const feature = existingPackage.items.find(
        (item) => item._id.toString() === featureId
      );
      console.log(feature, "rtyui");
      if (!feature) {
        throw new Error("Feature not found in the package");
      }

      return await this.eventRepo.featureBlock( packageId, featureId );
    
    } catch (error) {
      throw error;
    }
  }
  async deleteFeature(packageId:string, featureId:string):Promise<IPackage | null>{
    try {
      console.log(packageId,featureId);
      const existingPackage = await this.eventRepo.findById(packageId);
      if (!existingPackage) {
        throw new Error("Package not found");
      }
      const feature = existingPackage.items.find(
        (item) => item._id.toString() === featureId
      );
      console.log(feature, "rtyui");
      if (!feature) {
        throw new Error("Feature not found in the package");
      }

      return await this.eventRepo.deleteFeature(packageId,featureId)
    } catch (error) {
      throw error;
    }
  }
}
