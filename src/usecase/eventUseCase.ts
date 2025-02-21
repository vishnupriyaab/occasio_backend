import { IAddEventRegister, IEvent } from "../entities/event.entity";
import { IPackage, IPackageRegister } from "../entities/package.entity";
import IEventRepository from "../interfaces/repository/event.Repository";
import { IEventUseCase } from "../interfaces/useCase/event.useCase";
import { ICloudinaryService } from "../interfaces/integration/IClaudinary";

export class EventUseCase implements IEventUseCase{
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
    updatedData: any,
    file?: Express.Multer.File
  ): Promise<IPackage | null> {
    try {
      const eventId = updatedData.eventId;
      console.log(eventId, "eventid1234567");

      if (file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        updatedData.image = imageUrl;
      }

      const existingPackage = await this.eventRepo.getPackageById(
        packageId,
        eventId
      );
      console.log(existingPackage, "qwertyuiop");

      if (!existingPackage) {
        const error = new Error('Package not found for this event')
        error.name = 'PackageNotFound'
        throw error;
      } else {
        const updatedPackage = await this.eventRepo.updatedPackage(
          packageId,
          updatedData
        );
        console.log("Package successfully updated");
        return updatedPackage;
      }
    } catch (error: unknown) {
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
    packageName: string;
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


async addFeature(packageId: string, featureData: { name: string; amount: number }): Promise<IPackage | null> {
  try {
    console.log(packageId, featureData, "UseCase data");
    const existingPackage = await this.eventRepo.findById(packageId);
    if (!existingPackage) {
      throw new Error("Package not found");
    }

    // Check if feature name already exists in the package
    const featureExists = existingPackage.items.some(
      item => item.name.toLowerCase() === featureData.name.toLowerCase()
    );
    if (featureExists) {
      throw new Error("Feature with this name already exists in the package");
    }

    const newFeature = {
      name: featureData.name,
      amount: featureData.amount,
      isBlocked: false
    };

    return await this.eventRepo.addFeature(packageId, newFeature);
  } catch (error) {
    console.log("Error in addFeature useCase:", error);
    throw error;
  }
}

async updateFeature(packageId: string, featureId: string, featureData: { name: string; amount: number }): Promise<IPackage | null> {
  try {
    console.log(packageId, featureId, featureData, "UseCase update data");
    const existingPackage = await this.eventRepo.findById(packageId);
    if (!existingPackage) {
      throw new Error("Package not found");
    }
    const featureIndex = existingPackage.items.findIndex(
      item => item._id.toString() === featureId
    );
    if (featureIndex === -1) {
      throw new Error("Feature not found in package");
    }

    return await this.eventRepo.updateFeature(packageId, featureId, featureData);
  } catch (error) {
    console.log("Error in updateFeature useCase:", error);
    throw error;
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
