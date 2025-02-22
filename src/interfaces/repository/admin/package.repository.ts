import { IPackage, IPackageRegister } from "../../entities/package.entity";

export default interface IAdminPackageRepository {
    findByPackageName(packageName: string): Promise<IPackage | null>
    addPackage(newPackage: IPackageRegister): Promise<IPackage>
    getAllPackages(eventId : string): Promise<IPackage[]>
    getPackageById(packageId: string, eventId: string): Promise<IPackage | null>
    updatedPackage(packageId: string, updatedData: Partial<IPackage>): Promise<IPackage | null>
    findByPackageId(id: string): Promise<IPackage | null>
    deletePackage(id: string): Promise<void>
}