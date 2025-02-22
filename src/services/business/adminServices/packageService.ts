import { IPackage, IPackageRegister } from "../../../interfaces/entities/package.entity";
import { CloudinaryService } from "../../../integration/claudinaryService";
import { ICloudinaryService } from "../../../interfaces/integration/IClaudinary";
import IAdminPackageRepository from "../../../interfaces/repository/admin/package.repository";
import IAdminPackageService from "../../../interfaces/services/admin/package.services";
import { AdminPackageRepository } from "../../../repositories/entities/adminRepositories/packageRepository";

export class AdminPackageService implements IAdminPackageService {
  private _packageRepo: IAdminPackageRepository;
  private _cloudinaryService: ICloudinaryService;
  constructor(
    packageRepo: IAdminPackageRepository,
    cloudinaryService: ICloudinaryService
  ) {
    this._packageRepo = packageRepo;
    this._cloudinaryService = cloudinaryService;
  }

  async addPackage(packageData: any, file: Express.Multer.File): Promise<any> {
    console.log(packageData, file, "data in useCase,1234567890");
    try {
      const existingPackage = await this._packageRepo.findByPackageName(
        packageData.packageName
      );
      console.log(existingPackage, "existingPackage");
      if (existingPackage) {
        const error = new Error(
          `Package with name "${existingPackage.packageName}" already exists.`
        );
        error.name = "PackageAlreadyExists";
        throw error;
      }
      const imageUrl = await this._cloudinaryService.uploadImage(file);
      console.log(imageUrl, "imageUrl");

      const featuresName = packageData.items[0].name;
      // const featuresAmount = packageData.items[0].amount;
      console.log("features", featuresName);

      const newPackage: IPackageRegister = {
        packageName: packageData.packageName,
        startingAmnt: packageData.startingAmnt,
        eventId: packageData.eventId,
        items: packageData.items.map(
          (item: { name: string; amount: number; isBlocked: boolean }) => ({
            name: item.name,
            amount: Number(0),
            isBlocked: item.isBlocked || false,
          })
        ),
        image: imageUrl,
      };

      const setNewPackage = await this._packageRepo.addPackage(newPackage);
      return setNewPackage;
    } catch (error) {
      throw error;
    }
  }

  async getAllPackages(eventId: string): Promise<IPackage[]> {
    try {
      return this._packageRepo.getAllPackages(eventId);
    } catch (error) {
      throw error;
    }
  }

  async updatedPackage(
    packageId: string,
    updatedData: any,
    file?: Express.Multer.File
  ): Promise<IPackage | null> {
    try {
      const eventId = updatedData.eventId;
      console.log(eventId, "eventid1234567");

      if (file) {
        const imageUrl = await this._cloudinaryService.uploadImage(file);
        updatedData.image = imageUrl;
      }

      const existingPackage = await this._packageRepo.getPackageById(
        packageId,
        eventId
      );
      console.log(existingPackage, "qwertyuiop");

      if (!existingPackage) {
        const error = new Error("Package not found for this event");
        error.name = "PackageNotFound";
        throw error;
      } else {
        const updatedPackage = await this._packageRepo.updatedPackage(
          packageId,
          updatedData
        );
        console.log("Package successfully updated");
        return updatedPackage;
      }
    } catch (error: unknown) {
      throw error;
    }
  }

  async deletePackage(packageId: string): Promise<void> {
    try {
      const packagee = await this._packageRepo.findByPackageId(packageId);
      if (!packagee) {
        const error = new Error('Package not found');
        error.name = 'PackageNotFound';
        throw error;
      }
      await this._packageRepo.deletePackage(packageId);
      return;
    } catch (error) {
      throw error;
    }
  }

  async blockPackage(packageId: string): Promise<IPackage | null> {
    try {
      const packagee = await this._packageRepo.findByPackageId(packageId);
      if (!packagee) {
        throw new Error("Package not found");
      }
      packagee.isBlocked = !packagee.isBlocked;
      return await this._packageRepo.updatedPackage(packageId, {
        isBlocked: packagee.isBlocked,
      });
    } catch (error) {
      throw error;
    }
  }

}

const cloudinaryService = new CloudinaryService();
const adminPackageRepository = new AdminPackageRepository();
export const adminPackageService = new AdminPackageService(
  adminPackageRepository,
  cloudinaryService
);
