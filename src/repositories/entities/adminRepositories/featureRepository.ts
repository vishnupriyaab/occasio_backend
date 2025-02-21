import { IPackage } from "../../../entities/package.entity";
import IAdminFeatureRepository from "../../../interfaces/repository/admin/feature.repository";
import Package from "../../../models/packageModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class AdminFeatureRepository
  extends CommonBaseRepository<{ package: Document & IPackage }>
  implements IAdminFeatureRepository
{
  constructor() {
    super({ package: Package });
  }

  async findByPackageId(id: string): Promise<IPackage | null> {
    return this.findById("package", id).exec();
  }

  async addFeature(
    packageId: string,
    featureData: { name: string; amount: number; isBlocked: boolean }
  ): Promise<IPackage | null> {
    try {
      console.log(packageId, featureData, "Repository data");
      return await this.pushToArray(
        "package", // assuming 'package' is the model name in your repository
        { _id: packageId },
        "items",
        {
          name: featureData.name,
          amount: featureData.amount,
          isBlocked: featureData.isBlocked,
        }
      );
    } catch (error) {
      console.log("Error in addFeature repository:", error);
      throw error;
    }
  }

  async updateFeature(packageId: string, featureId: string, featureData: { name: string; amount: number }): Promise<IPackage | null> {
    try {
      console.log(packageId, featureId, featureData, "Repository update data");
      return await this.updateArrayItem(
        'package', // assuming 'package' is your model name
        { _id: packageId },
        'items',
        featureId,
        {
          name: featureData.name,
          amount: featureData.amount
        }
      );
    } catch (error) {
      console.log("Error in updateFeature repository:", error);
      throw error;
    }
  }

  async featureBlock(packageId: string, featureId: string): Promise<IPackage | null> {
    try {
      return await this.toggleFeatureBlockStatus('package', packageId, featureId);
    } catch (error) {
      console.log("Error in featureBlock repository:", error);
      throw error;
    }
  }

  async deleteFeature(packageId: string, featureId: string): Promise<IPackage | null> {
    try {
      const updatedPackage = await this.pullFromArray(
        'package',
        packageId,
        'items',
        { _id: featureId }
      );
  
    //   if (!updatedPackage) {
    //     const error = new Error("Package not found");
    //     error.name = 'PackageNotFound';
    //     throw error;
    //   }
  
      return updatedPackage;
    } catch (error) {
      console.log("Error in deleteFeature repository:", error);
      throw error;
    }
  }

//   async searchFeatures(
//     packageId: string,
//     searchTerm: string,
//     filterStatus: string | undefined,
//     page: number,
//     limit: number
//   ): Promise<{
//     packageName: string;
//     features: Array<{
//       name: string;
//       isBlocked: boolean;
//       amount: number;
//     }>;
//     totalFeatures: number;
//     totalPages: number;
//     currentPage: number;
//   }> {
//     try {
//       const packagee = await Package.findById(packageId).lean();
//       if (!packagee) {
//         const error = new Error('Package not found');
//         error.name = 'PackageNotFound';
//         throw error;
//       }

//       let filteredItems = packagee.items || [];

//       if (searchTerm && searchTerm.trim() !== "") {
//         filteredItems = filteredItems.filter((item) =>
//           item.name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
//         );
//       }

//       console.log(filterStatus,"filter")
//       if (filterStatus === "blocked") {
//         filteredItems = filteredItems.filter((item) => item.isBlocked === true);
//       } else if (filterStatus === "unblocked") {
//         filteredItems = filteredItems.filter(
//           (item) => item.isBlocked === false
//         );
//       }

//       const totalFeatures = filteredItems.length;
//       const totalPages = Math.max(1, Math.ceil(totalFeatures / limit));
//       const skip = Math.max(0, (page - 1) * limit);

//       const paginatedItems = filteredItems.slice(skip, skip + limit);

//       console.log(paginatedItems,"pag")

//       return {
//         packageName: packagee.packageName,
//         features: paginatedItems,
//         totalFeatures,
//         totalPages,
//         currentPage: page,
//       };
//     } catch (error) {
//       console.error("Repository Search Error:", error);
//       throw new Error(
//         `Failed to search features: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`
//       );
//     }
//   }

async searchFeatures(
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
        const packagee = await this.findById('package', packageId).lean() as unknown as IPackage;
        if (!packagee) {
            const error = new Error('Package not found');
            error.name = 'PackageNotFound';
            throw error;
        }

        let filteredItems = packagee.items || [];

        // Apply search term filter if provided
        if (searchTerm && searchTerm.trim() !== "") {
            filteredItems = filteredItems.filter((item: { name: string; }) =>
                item.name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
            );
        }

        // Apply status filter if provided
        console.log(filterStatus, "filter");
        if (filterStatus === "blocked") {
            filteredItems = filteredItems.filter((item: { isBlocked: boolean; }) => item.isBlocked === true);
        } else if (filterStatus === "unblocked") {
            filteredItems = filteredItems.filter(
                (item: { isBlocked: boolean; }) => item.isBlocked === false
            );
        }

        // Calculate pagination values
        const totalFeatures = filteredItems.length;
        const totalPages = Math.max(1, Math.ceil(totalFeatures / limit));
        const skip = Math.max(0, (page - 1) * limit);

        // Apply pagination
        const paginatedItems = filteredItems.slice(skip, skip + limit);

        console.log(paginatedItems, "pag");

        return {
            packageName: packagee.packageName,
            features: paginatedItems,
            totalFeatures,
            totalPages,
            currentPage: page,
        };
    } catch (error) {
        console.error("Repository Search Error:", error);
        throw new Error(
            `Failed to search features: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}


}
