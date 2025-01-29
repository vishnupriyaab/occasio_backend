export interface IPackage{
    _id:string;
    eventId: string;
    packageName: string;
    startingAmnt: number;
    image: string;
    items: IPackageItem[];
    createdAt: Date;
    updatedAt: Date;
    // isActive: boolean;
    isBlocked: boolean;
}


export interface IPackageItem {
    itemName: string;
    price: number;
    status: boolean;
  }

export interface IPackageRegister {
    _id: string;
    packageName: string;
    startingAmnt: number;
    img: string;
    eventId: string;
  }