import mongoose from "mongoose";
import { IAddEventRegister, IEvent } from "../../../interfaces/entities/event.entity";
import IAdminEventRepository from "../../../interfaces/repository/admin/event.repository";
import Event from "../../../models/EventModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class AdminEventRepository
  extends CommonBaseRepository<{ event: Document & IEvent }>
  implements IAdminEventRepository
{
  constructor() {
    super({ event: Event });
  }

  async findByEventName(eventName: string): Promise<IEvent | null> {
    return this.findOne("event", { eventName });
  }

  async findByEventId(id: string): Promise<IEvent | null> {
    return this.findById("event", id).exec();
}

  async addEvent(event: IAddEventRegister): Promise<IEvent> {
    return this.createData("event", event);
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
    const query: mongoose.FilterQuery<IEvent> = {};

    // Build search query
    if (searchTerm && searchTerm.trim() !== "") {
      query.eventName = {
        $regex: searchTerm.trim(),
        $options: "i",
      };
    }

    // Apply status filter
    if (filterStatus === "blocked") {
      query.isBlocked = true;
    } else if (filterStatus === "unblocked") {
      query.isBlocked = false;
    }

    const skip = Math.max(0, (page - 1) * limit);

    try {
      // Use Promise.all with base repository methods
      const [events, totalEvents] = await Promise.all([
        this.findMany("event", query, {
          skip,
          limit,
          sort: { createdAt: -1 },
        }),
        this.count("event", query),
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

  async updateEvent(
    id: string,
    updatedData: Partial<IEvent>
  ): Promise<IEvent | null> {
    return this.updateById("event", id, updatedData);
  }

  async deleteEvent(id: string): Promise<void> {
    await this.deleteById("event", id);
}
}
