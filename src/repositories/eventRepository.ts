import { IAddEventRegister, IEvent } from "../entities/event.entity";
import { IPackage, IPackageRegister } from "../entities/package.entity";
import Event from "../framework/models/EventModel";
import Package from "../framework/models/packageModel";

export class EventRepository {
  async addEvent(event: IAddEventRegister): Promise<IEvent | void> {
    console.log(event, "qwertyuioertyuio");
    const newEvent = new Event(event);
    return newEvent.save();
  }
  async findByEventName(eventName: string): Promise<IEvent | null> {
    return Event.findOne({ eventName });
  }

  async getAllEvents(): Promise<IEvent[]> {
    return Event.find().sort({ createdAt: -1 });
  }

  async updateEvent(id: string, updatedData: any): Promise<IEvent | null> {
    return Event.findByIdAndUpdate(id, updatedData, { new: true });
  }
  async findByEventId(id:string):Promise<IEvent | null> {
    return await Event.findById(id);
  }
  
  async findByPackageId(id:string):Promise<IEvent | null> {
    return await Package.findById(id);
  }

  async deleteEvent(id:string) {
    return await Event.findByIdAndDelete(id);
  }
  async deletePackage(id:string) {
    return await Package.findByIdAndDelete(id);
  }

  async findByPackageName(packageName: string): Promise<IPackage | null> {
    return Package.findOne({ packageName });
  }

  async addPackage(newPackage: IPackageRegister): Promise<IPackage | void> {
    console.log(newPackage, "qwertyuioertyuio");
    const newPackagee = new Package(newPackage);
    return newPackagee.save();
  }

  async getAllPackages(eventId: string): Promise<IPackage[]> {
    return Package.find({ eventId }).sort({ createdAt: -1 });
  }

  async updatedPackage(packageId:string,updatedData:any):Promise<IPackage | null>{
    try {
      console.log("1234567890sdfghjk")
      return await Package.findByIdAndUpdate( {_id: packageId} , updatedData, { new: true });
    } catch (error) {
      throw new Error("Failed to update package in repository");
    }
  }

  async getPackageById(packageId: string, eventId: string): Promise<IPackage | null> {
    return Package.findOne({ _id: packageId, eventId: eventId })
  }


}
