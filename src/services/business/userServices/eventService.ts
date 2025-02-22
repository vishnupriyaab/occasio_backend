import { IEvent } from "../../../interfaces/entities/event.entity";
import IUserEventRepository from "../../../interfaces/repository/user/event.repository";
import IUserEventService from "../../../interfaces/services/user/event.services";
import { UserEventRepository } from "../../../repositories/entities/userRepositories/eventRepository";

export class UserEventService implements IUserEventService {
  private _eventRepo: IUserEventRepository;
  constructor(eventRepo: IUserEventRepository) {
    this._eventRepo = eventRepo;
  }

  //getEvents
  async getEvents(): Promise<IEvent[]> {
    try {
      return this._eventRepo.getEvents();
    } catch (error: unknown) {
      throw error;
    }
  }
}

const userEventRepository = new UserEventRepository();
export const userEventService = new UserEventService(userEventRepository);
