import { IEvent } from "../../../interfaces/entities/event.entity";
import IUserEventRepository from "../../../interfaces/repository/user/event.repository";
import Event from "../../../models/EventModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class UserEventRepository
  extends CommonBaseRepository<{ event: Document & IEvent }>
  implements IUserEventRepository
{
  constructor() {
    super({ event: Event });
  }

  async getEvents(): Promise<IEvent[]> {
    return this.findMany("event", {}, { sort: { createdAt: -1 } });
  }
}
