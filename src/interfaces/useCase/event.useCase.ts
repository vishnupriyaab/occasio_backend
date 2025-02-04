import { IEvent } from "../../entities/event.entity";
import { IPackage } from "../../entities/package.entity";

export interface IEventUseCase {
  addEvent(eventData: any, file: Express.Multer.File): Promise<any>;
  updateEvent(id: string, updatedData: any): Promise<IEvent | undefined | null>;
  blockEvent(eventId: string): Promise<IEvent | null>;
  deleteEvent(eventId: string): Promise<void>;
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
  addPackage(packageData: any, file: Express.Multer.File): Promise<any>;
  getAllPackages(eventId: string): Promise<IPackage[]>;
  updatedPackage(packageId: string, updatedData: any): Promise<IPackage | null>;
  deletePackage(packageId: string): Promise<void>;
  blockPackage(packageId: string): Promise<IPackage | null>;
  searchFeature(
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
  blockFeature(packageId: string, featureId: string): Promise<IPackage | null>;
  deleteFeature(packageId: string, featureId: string): Promise<IPackage | null>;
}
