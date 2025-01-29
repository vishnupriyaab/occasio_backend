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

  async getAllEvents(): Promise<IEvent[]> {
    try {
      return Event.find().sort({ createdAt: -1 });
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
  async findByEventId(id:string):Promise<IEvent | null> {
    try {
      return await Event.findById(id);
    } catch (error) {
      throw error;
    }
  }
  
  async findByPackageId(id:string):Promise<IEvent | null> {
    try {
      return await Package.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteEvent(id:string):Promise<void> {
    try {
       await Event.findByIdAndDelete(id);
       return;
    } catch (error) {
      throw error;
    }
  }
  
  async deletePackage(id:string):Promise<void> {
    try {
       await Package.findByIdAndDelete(id);
       return
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
      console.log(newPackage, "qwertyuioertyuio");
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

  async updatedPackage(packageId:string,updatedData:any):Promise<IPackage | null>{
    try {
      console.log("1234567890sdfghjk")
      return await Package.findByIdAndUpdate( {_id: packageId} , updatedData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async getPackageById(packageId: string, eventId: string): Promise<IPackage | null> {
    try {
      return Package.findOne({ _id: packageId, eventId: eventId })
    } catch (error) {
      throw error;
    }
  }

  // async searchEvent(searchTerm:string, filterStatus:string | undefined, page:number, limit:number):Promise<IEvent[] | any>{
  //   try {
  //     // let query:any = { eventName: {$regex: searchTerm, $options: 'i'} };
  //     // if(filterStatus === 'blocked'){
  //     //   query.isBlocked = true;
  //     // }else if(filterStatus === 'unblocked'){
  //     //   query.isBlocked = false;
  //     // }
  //     // return await Event.find(query);
  //     // Construct dynamic query
  //   const query: any = {};

  //   // Add search term if provided
  //   if (searchTerm) {
  //     query.eventName = { $regex: searchTerm, $options: 'i' };
  //   }

  //   // Add status filter if provided
  //   if (filterStatus === 'blocked') {
  //     query.isBlocked = true;
  //   } else if (filterStatus === 'unblocked') {
  //     query.isBlocked = false;
  //   }

  //   // Calculate skip value for pagination
  //   const skip = (page - 1) * limit;

  //   // Perform query with pagination
  //   const events = await Event.find(query)
  //     .skip(skip)
  //     .limit(limit)
  //     .sort({ createdAt: -1 }); // Optional: sort by most recent

  //   // Count total matching documents
  //   const totalEvents = await Event.countDocuments(query);

  //   // Calculate total pages
  //   const totalPages = Math.ceil(totalEvents / limit);

  //   console.log(events,totalEvents,totalPages,page,"123456789010123456789010");
    

  //   return {
  //     events,
  //     totalEvents,
  //     totalPages,
  //     currentPage: page
  //   };
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
      // Construct dynamic query with type safety
      const query: mongoose.FilterQuery<IEvent> = {};
  
      // Search term filtering (case-insensitive)
      if (searchTerm && searchTerm.trim() !== '') {
        query.eventName = { 
          $regex: searchTerm.trim(), 
          $options: 'i' 
        };
      }
  
      // Status filtering
      if (filterStatus === 'blocked') {
        query.isBlocked = true;
      } else if (filterStatus === 'unblocked') {
        query.isBlocked = false;
      }
  
      // Pagination calculations
      const skip = Math.max(0, (page - 1) * limit);
  
      // Perform parallel queries for efficiency
      const [events, totalEvents] = await Promise.all([
        Event.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }) // Most recent first
          .lean(), // Convert to plain JavaScript objects
        Event.countDocuments(query)
      ]);
  
      // Calculate total pages
      const totalPages = Math.max(1, Math.ceil(totalEvents / limit));
  
      return {
        events,
        totalEvents,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      // Enhanced error handling
      console.error('Repository Search Error:', error);
      throw new Error(`Failed to search events: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  }

// }
