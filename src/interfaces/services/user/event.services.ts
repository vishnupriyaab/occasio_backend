import { IEvent } from "../../../entities/event.entity";

export default interface IUserEventService{
    getEvents(): Promise<IEvent[]>;
}