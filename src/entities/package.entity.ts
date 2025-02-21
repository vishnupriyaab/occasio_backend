export interface IPackage {
  _id: string;
  eventId: string;
  packageName: string;
  startingAmnt: number;
  image: string;
  items: {
    _id: string;
    name: string;
    amount: number;
    isBlocked: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isBlocked: boolean;
}

export interface IPackageRegister {
  packageName: string;
  startingAmnt: number;
  eventId: string;
  items: {
    _id:string;
    name: string;
    isBlocked: boolean;
    amount: number;
  }[];
  image: string;
}
