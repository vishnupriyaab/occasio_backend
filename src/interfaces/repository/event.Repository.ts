import { IAddEventRegister, IEvent } from "../../entities/event.entity";
import { IPackage, IPackageRegister } from "../../entities/package.entity";

export default interface IEventRepository {
  getEvents():Promise<IEvent[]>
  addEvent(event: IAddEventRegister): Promise<IEvent | void>;
  findByEventName(eventName: string): Promise<IEvent | null>;
  updateEvent(id: string, updatedData: any): Promise<IEvent | null>;
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
  findByPackageId(id: string): Promise<IEvent | null>;
  deleteEvent(id: string): Promise<void>;
  deletePackage(id: string): Promise<void>;
  findByPackageName(packageName: string): Promise<IPackage | null>;
  addPackage(newPackage: IPackageRegister): Promise<IPackage | void>;
  getAllPackages(eventId: string): Promise<IPackage[]>;
  updatedPackage(packageId: string, updatedData: any): Promise<IPackage | null>;
  getPackageById(packageId: string, eventId: string): Promise<IPackage | null>;
  searchFeatures(
    packageId: string,
    searchTerm: string,
    filterStatus: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    packageName: string;
    features: Array<{
      name: string;
      isBlocked: boolean;
      amount: number;
    }>;
    totalFeatures: number;
    totalPages: number;
    currentPage: number;
  }>;
  findById(packageId: string): Promise<IPackage | null>;
  featureBlock(packageId: string, featureId: string): Promise<IPackage | null>;
  deleteFeature(packageId: string, featureId: string): Promise<IPackage | null>;
}
