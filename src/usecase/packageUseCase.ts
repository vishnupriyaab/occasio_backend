import { IPackageRegister } from "../entities/package.entity";
import { PackageRepository } from "../repositories/packageRepository";

export class PackageUseCase{
    constructor(private packageRepo: PackageRepository){}
    async addPackage(packageData:any, file:Express.Multer.File){
        console.log(packageData,file,"1234567890-ert789")
        try {
            console.log("wow its awsome")
            // const package:IPackageRegister = {
            //     ...packageData,
            //     // image:
            // }
        } catch (error) {
            throw new Error("Failed to create package");
        }
    }
}