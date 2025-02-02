import mongoose from "mongoose";
import { IAddEventRegister, IEvent } from "../entities/event.entity";
import { IPackage, IPackageRegister } from "../entities/package.entity";
import Event from "../framework/models/EventModel";
import Package from "../framework/models/packageModel";

export class EventRepository {
  async addEvent(event: IAddEventRegister): Promise<IEvent | void> {
    try {
      console.log(event, "qwertyuioertyuio");
      const newEvent = new Event(event);
      return newEvent.save();
    } catch (error) {
      throw error;
    }
  }
  async findByEventName(eventName: string): Promise<IEvent | null> {
    try {
      return Event.findOne({ eventName });
    } catch (error) {
      throw error;
    }
  }

  async updateEvent(id: string, updatedData: any): Promise<IEvent | null> {
    try {
      return Event.findByIdAndUpdate(id, updatedData, { new: true });
    } catch (error) {
      throw error;
    }
  }
  async findByEventId(id: string): Promise<IEvent | null> {
    try {
      return await Event.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findByPackageId(id: string): Promise<IEvent | null> {
    try {
      return await Package.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      await Event.findByIdAndDelete(id);
      return;
    } catch (error) {
      throw error;
    }
  }

  async deletePackage(id: string): Promise<void> {
    try {
      await Package.findByIdAndDelete(id);
      return;
    } catch (error) {
      throw error;
    }
  }

  async findByPackageName(packageName: string): Promise<IPackage | null> {
    try {
      console.log("12221");
      return Package.findOne({ packageName });
    } catch (error) {
      throw error;
    }
  }

  async addPackage(newPackage: IPackageRegister): Promise<IPackage | void> {
    try {
      console.log("1234567890");
      const newPackagee = new Package(newPackage);
      return newPackagee.save();
    } catch (error) {
      throw error;
    }
  }

  async getAllPackages(eventId: string): Promise<IPackage[]> {
    try {
      return Package.find({ eventId }).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  async updatedPackage(
    packageId: string,
    updatedData: any
  ): Promise<IPackage | null> {
    try {
      return await Package.findByIdAndUpdate({ _id: packageId }, updatedData, {
        new: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getPackageById(
    packageId: string,
    eventId: string
  ): Promise<IPackage | null> {
    try {
      return Package.findOne({ _id: packageId, eventId: eventId });
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
      const query: mongoose.FilterQuery<IEvent> = {};

      if (searchTerm && searchTerm.trim() !== "") {
        query.eventName = {
          $regex: searchTerm.trim(),
          $options: "i",
        };
      }

      if (filterStatus === "blocked") {
        query.isBlocked = true;
      } else if (filterStatus === "unblocked") {
        query.isBlocked = false;
      }
      const skip = Math.max(0, (page - 1) * limit);

      const [events, totalEvents] = await Promise.all([
        Event.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        Event.countDocuments(query),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalEvents / limit));

      return {
        events,
        totalEvents,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error("Repository Search Error:", error);
      throw new Error(
        `Failed to search events: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async searchFeatures(
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
      const packagee = await Package.findById(packageId).lean();
      if (!packagee) {
        throw new Error("Package not found");
      }

      let filteredItems = packagee.items || [];

      if (searchTerm && searchTerm.trim() !== "") {
        filteredItems = filteredItems.filter((item) =>
          item.name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
      }

      console.log(filterStatus,"filter")
      if (filterStatus === "blocked") {
        filteredItems = filteredItems.filter((item) => item.isBlocked === true);
      } else if (filterStatus === "unblocked") {
        filteredItems = filteredItems.filter(
          (item) => item.isBlocked === false
        );
      }

      const totalFeatures = filteredItems.length;
      const totalPages = Math.max(1, Math.ceil(totalFeatures / limit));
      const skip = Math.max(0, (page - 1) * limit);

      const paginatedItems = filteredItems.slice(skip, skip + limit);

      console.log(paginatedItems,"pag")

      return {
        packageName: packagee.packageName,
        features: paginatedItems,
        totalFeatures,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error("Repository Search Error:", error);
      throw new Error(
        `Failed to search features: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findById(packageId:string):Promise<IPackage | null>{
    return await Package.findById(packageId);
  }

  async featureBlock(packageId: string, featureId: string):Promise<IPackage | null>{
    try {
      
      // Find the package
      const packagee = await Package.findById(packageId);
        
      if (!packagee) {
        throw new Error("Package not found");
      }
  
      // Find the feature in the items array
      const feature = packagee.items.find(
        item => item._id.toString() === featureId
      );
      console.log(feature,'123')
  
      if (!feature) {
        throw new Error("Feature not found");
      }
  
      // Toggle the isBlocked status
      feature.isBlocked = !feature.isBlocked;
  
      // Save the changes
      return await Package.findOneAndUpdate(
        { _id: packageId },
        { items: packagee.items },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteFeature(packageId: string, featureId: string): Promise<IPackage | null> {
    try {
      const updatedPackage = await Package.findByIdAndUpdate(
        packageId,
        { $pull: { items: { _id: featureId } } }, 
        { new: true } 
      );
  
      if (!updatedPackage) {
        throw new Error("Package not found");
      }
  
      return updatedPackage;
    } catch (error) {
      throw error;
    }
  }
  

}
