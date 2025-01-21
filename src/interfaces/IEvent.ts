import { Request, Response } from "express"
import { IAddEventRegister, IEvent } from "../entities/event.entity"
import { IPackage, IPackageRegister } from "../entities/package.entity"

export interface IEventController{
    addEvent(req: Request, res: Response): Promise<void>
    getEvents(req: Request, res: Response): Promise<void>
    updateEvent(req: Request, res: Response): Promise<void>
    blockEvent(req: Request, res: Response): Promise<void>
    deleteEvent(req: Request, res: Response): Promise<void>
    addPackage(req: Request, res: Response):Promise<void>
    getPackages(req: Request, res: Response):Promise<void>
    updatePackage(req: Request, res: Response): Promise<void>
    deletePackage(req: Request, res: Response): Promise<void>
    blockPackage(req: Request, res: Response): Promise<void>
}

export interface IEventUseCase{
    addEvent(eventData: any, file: Express.Multer.File):Promise<any>
    getAllEvents(): Promise<IEvent[] | undefined>
    updateEvent(id: string, updatedData: any): Promise<IEvent | undefined | null>
    blockEvent(eventId: string): Promise<IEvent | null>
    deleteEvent(eventId: string):Promise<void>
    addPackage(packageData: any, file: Express.Multer.File):Promise<any>
    getAllPackages(eventId: string): Promise<IPackage[]>
    updatedPackage( packageId: string, updatedData: any ): Promise<IPackage | null>
    deletePackage(packageId:string):Promise<void>
    blockPackage(packageId: string): Promise<IPackage | null>
}

export interface IEventRepository{
    addEvent(event: IAddEventRegister): Promise<IEvent | void>
    findByEventName(eventName: string): Promise<IEvent | null>
    getAllEvents(): Promise<IEvent[]>
    updateEvent(id: string, updatedData: any): Promise<IEvent | null>
    findByEventId(id:string):Promise<IEvent | null>
    findByPackageId(id:string):Promise<IEvent | null>
    deleteEvent(id:string):Promise<void>
    deletePackage(id:string):Promise<void>
    findByPackageName(packageName: string): Promise<IPackage | null>
    addPackage(newPackage: IPackageRegister): Promise<IPackage | void>
    getAllPackages(eventId: string): Promise<IPackage[]>
    updatedPackage(packageId:string,updatedData:any):Promise<IPackage | null>
    getPackageById(packageId: string, eventId: string): Promise<IPackage | null>
}