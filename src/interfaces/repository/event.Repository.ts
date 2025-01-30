import { IAddEventRegister, IEvent } from "../../entities/event.entity"
import { IPackage, IPackageRegister } from "../../entities/package.entity"

export default interface IEventRepository{
    addEvent(event: IAddEventRegister): Promise<IEvent | void>
    findByEventName(eventName: string): Promise<IEvent | null>
    // getAllEvents(): Promise<IEvent[]>
    updateEvent(id: string, updatedData: any): Promise<IEvent | null>
    findByEventId(id:string):Promise<IEvent | null>
    searchEvent(searchTerm:string, filterStatus:string | undefined,page:number, limit:number):Promise<{ events: IEvent[],  totalEvents: number,  totalPages: number,  currentPage: number }>
    findByPackageId(id:string):Promise<IEvent | null>
    deleteEvent(id:string):Promise<void>
    deletePackage(id:string):Promise<void>
    findByPackageName(packageName: string): Promise<IPackage | null>
    addPackage(newPackage: IPackageRegister): Promise<IPackage | void>
    getAllPackages(eventId: string): Promise<IPackage[]>
    updatedPackage(packageId:string,updatedData:any):Promise<IPackage | null>
    getPackageById(packageId: string, eventId: string): Promise<IPackage | null>
}