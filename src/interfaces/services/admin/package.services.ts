import { IPackage } from "../../entities/package.entity"

export default interface IAdminPackageService {
    addPackage(packageData: any, file: Express.Multer.File): Promise<any>
    getAllPackages(eventId: string): Promise<IPackage[]>
    updatedPackage(
        packageId: string,
        updatedData: any,
        file?: Express.Multer.File
      ): Promise<IPackage | null>
      deletePackage(packageId: string): Promise<void>
      blockPackage(packageId: string): Promise<IPackage | null>
}