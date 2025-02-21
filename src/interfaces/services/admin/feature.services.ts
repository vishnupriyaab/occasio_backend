import { IPackage } from "../../../entities/package.entity";

export default interface IAdminFeatureService {
  addFeature(
    packageId: string,
    featureData: { name: string; amount: number }
  ): Promise<IPackage | null>;
  updateFeature(
    packageId: string,
    featureId: string,
    featureData: { name: string; amount: number }
  ): Promise<IPackage | null>;
  blockFeature(packageId: string, featureId: string): Promise<IPackage | null>;
  deleteFeature(packageId: string, featureId: string): Promise<IPackage | null>;
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
  }>
}
