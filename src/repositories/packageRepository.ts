import { IPackage, IPackageRegister } from "../entities/package.entity";
import Package from "../framework/models/packageModel";

export class PackageRepository {
  async addPackage(): Promise<IPackage | void> {
    // const newPackage = new Package(package);
    // return newPackage.save();
  }
}
