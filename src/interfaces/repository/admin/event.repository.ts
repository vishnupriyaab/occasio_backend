import { IAddEventRegister, IEvent } from "../../entities/event.entity";

export default interface IAdminEventRepository {
  addEvent(event: IAddEventRegister): Promise<IEvent>;
  findByEventName(eventName: string): Promise<IEvent | null>;
  findByEventId(id: string): Promise<IEvent | null>;
  searchEvent(
    searchTerm: string,
    filterStatus: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    events: IEvent[];
    totalEvents: number;
    totalPages: number;
    currentPage: number;
  }>;
  updateEvent(id: string, updatedData: Partial<IEvent>): Promise<IEvent | null>;
  deleteEvent(id: string): Promise<void>;
}
