import { IPackage } from "../../../interfaces/entities/package.entity";
import IAdminFeatureRepository from "../../../interfaces/repository/admin/feature.repository";
import IAdminFeatureService from "../../../interfaces/services/admin/feature.services";
import { AdminFeatureRepository } from "../../../repositories/entities/adminRepositories/featureRepository";

export class AdminFeatureService implements IAdminFeatureService {
  private featureRepo: IAdminFeatureRepository;
  constructor(featureRepo: IAdminFeatureRepository) {
    this.featureRepo = featureRepo;
  }

  async addFeature(
    packageId: string,
    featureData: { name: string; amount: number }
  ): Promise<IPackage | null> {
    try {
      console.log(packageId, featureData, "UseCase data");
      const existingPackage = await this.featureRepo.findByPackageId(packageId);
      if (!existingPackage) {
        const error = new Error("Package not found");
        error.name = "PackageNotFound";
        throw error;
      }

      // Check if feature name already exists in the package
      const featureExists = existingPackage.items.some(
        (item) => item.name.toLowerCase() === featureData.name.toLowerCase()
      );
      if (featureExists) {
        const error = new Error(
          "Feature with this name already exists in the package"
        );
        error.name = "FeatureAlreadyExists";
        throw error;
      }

      const newFeature = {
        name: featureData.name,
        amount: featureData.amount,
        isBlocked: false,
      };

      return await this.featureRepo.addFeature(packageId, newFeature);
    } catch (error) {
      console.log("Error in addFeature useCase:", error);
      throw error;
    }
  }

  async updateFeature(
    packageId: string,
    featureId: string,
    featureData: { name: string; amount: number }
  ): Promise<IPackage | null> {
    try {
      console.log(packageId, featureId, featureData, "UseCase update data");
      const existingPackage = await this.featureRepo.findByPackageId(packageId);
      if (!existingPackage) {
        const error = new Error("Package not found");
        error.name = "PackageNotFound";
        throw error;
      }
      const featureIndex = existingPackage.items.findIndex(
        (item) => item._id.toString() === featureId
      );
      if (featureIndex === -1) {
        const error = new Error("Feature not found in package");
        error.name = "FeatureNotFound";
        throw error;
      }

      return await this.featureRepo.updateFeature(
        packageId,
        featureId,
        featureData
      );
    } catch (error) {
      throw error;
    }
  }

  async blockFeature(
    packageId: string,
    featureId: string
  ): Promise<IPackage | null> {
    try {
      console.log(packageId, featureId);

      if (!packageId) {
        const error = new Error("PackageId is required");
        error.name = "PackageIdRequired";
        throw error;
      }
      if (!featureId) {
        const error = new Error("FeatureId is required");
        error.name = "featureIdRequired";
        throw error;
      }

      const existingPackage = await this.featureRepo.findByPackageId(packageId);
      if (!existingPackage) {
        const error = new Error("Package not found");
        error.name = "PackageNotFound";
        throw error;
      }

      const feature = existingPackage.items.find(
        (item) => item._id.toString() === featureId
      );
      if (!feature) {
        const error = new Error("Feature not found in the package");
        error.name = "FeatureNotFound";
        throw error;
      }

      return await this.featureRepo.featureBlock(packageId, featureId);
    } catch (error) {
      throw error;
    }
  }

  async deleteFeature(
    packageId: string,
    featureId: string
  ): Promise<IPackage | null> {
    try {
      console.log(packageId, featureId);

      if (!packageId) {
        const error = new Error("PackageId is required");
        error.name = "PackageIdRequired";
        throw error;
      }
      if (!featureId) {
        const error = new Error("FeatureId is required");
        error.name = "featureIdRequired";
        throw error;
      }

      const existingPackage = await this.featureRepo.findByPackageId(packageId);
      if (!existingPackage) {
        const error = new Error("Package not found");
        error.name = "PackageNotFound";
        throw error;
      }

      const feature = existingPackage.items.find(
        (item) => item._id.toString() === featureId
      );
      console.log(feature, "rtyui");
      if (!feature) {
        const error = new Error("Feature not found in the package");
        error.name = "FeatureNotFound";
        throw error;
      }

      return await this.featureRepo.deleteFeature(packageId, featureId);
    } catch (error) {
      throw error;
    }
  }

  async searchFeature(
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
  }> {
    try {
      if (page < 1 || limit < 1) {
        const error = new Error("Invalid Page Or Limit");
        error.name = "InvalidPageOrLimit";
        throw error;
      }

      return await this.featureRepo.searchFeatures(
        packageId,
        searchTerm,
        filterStatus,
        page,
        limit
      );
    } catch (error) {
      throw new Error(
        `Use case search failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

const adminfeatureRepository = new AdminFeatureRepository();
export const adminFeatureService = new AdminFeatureService(
  adminfeatureRepository
);
