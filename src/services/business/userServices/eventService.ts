import { IEvent } from "../../../entities/event.entity";
import IUserEventRepository from "../../../interfaces/repository/user/event.repository";
import IUserEventService from "../../../interfaces/services/user/event.services";
import { UserEventRepository } from "../../../repositories/entities/userRepositories/eventRepository";

export class UserEventService implements IUserEventService {
  private eventRepo: IUserEventRepository;
  constructor(eventRepo: IUserEventRepository) {
    this.eventRepo = eventRepo;
  }

  //getEvents
  async getEvents(): Promise<IEvent[]> {
    try {
      return this.eventRepo.getEvents();
    } catch (error: unknown) {
      throw error;
    }
  }
}

const userEventRepository = new UserEventRepository();
export const userEventService = new UserEventService(userEventRepository);
