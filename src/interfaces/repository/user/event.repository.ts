import { IEvent } from "../../../entities/event.entity";

export default interface IUserEventRepository{
    getEvents(): Promise<IEvent[]>;
}