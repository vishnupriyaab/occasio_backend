import { IAddEventRegister, IEvent } from "../entities/event.entity";
import Event from "../framework/models/EventModel";

export class EventRepository {
  async addEvent(event: IAddEventRegister): Promise<IEvent | void> {
    // console.log(event, "qwertyuioertyuio");
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
  async findById(id:string):Promise<IEvent | null> {
    return await Event.findById(id);
  }

  async update(id:string, updateData:any):Promise<IEvent | null> {
    return await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  async delete(id:string) {
    return await Event.findByIdAndDelete(id);
  }
}
