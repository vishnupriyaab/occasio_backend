import { IPackage, IPackageRegister } from "../../../interfaces/entities/package.entity";
import IAdminPackageRepository from "../../../interfaces/repository/admin/package.repository";
import Package from "../../../models/packageModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class AdminPackageRepository
  extends CommonBaseRepository<{ package: Document & IPackage }>
  implements IAdminPackageRepository
{
  constructor() {
    super({ package: Package });
  }

  async findByPackageName(packageName: string): Promise<IPackage | null> {
    return this.findOne("package", { packageName });
  }

  async addPackage(newPackage: IPackageRegister): Promise<IPackage> {
    return this.createData("package", newPackage);
  }

//   async getAllPackages(eventId: string): Promise<IPackage[]> {
//     try {
//       return Package.find({ eventId }).sort({ createdAt: -1 });
//     } catch (error) {
//       throw error;
//     }
//   }

    async getAllPackages(eventId : string): Promise<IPackage[]> {
      return this.findMany("package", { eventId }, { sort: { createdAt: -1 } });
    }

    async getPackageById(packageId: string, eventId: string): Promise<IPackage | null> {
        return this.findOne("package", { 
            _id: packageId, 
            eventId: eventId 
        });
    }

    async updatedPackage(packageId: string, updatedData: Partial<IPackage>): Promise<IPackage | null> {
        return this.updateById("package", packageId, updatedData);
    }

    async findByPackageId(id: string): Promise<IPackage | null> {
        return this.findById("package", id).exec();
    }

    async deletePackage(id: string): Promise<void> {
        await this.deleteById("package", id);
    }

}
