import { IEvent } from "../../../entities/event.entity";

export default interface IAdminEventService {
  addEvent(eventData: any, file: Express.Multer.File): Promise<any>;
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
  updateEvent(
    id: string,
    updatedData: any,
    file?: Express.Multer.File
  ): Promise<IEvent | undefined | null>;
  deleteEvent(eventId: string): Promise<void>
  blockEvent(eventId: string): Promise<IEvent | null>
}
