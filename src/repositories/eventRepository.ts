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

}
