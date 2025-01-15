export interface IUser {
  _id: string;
  name: string;
  email: string;
  imageUrl:string;
  mobile: number;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  isBlocked: boolean;
  resetPasswordToken?: string;
  isGoogleAuth:boolean;
}

export interface IRegisterUser {
  name: string;
  email: string;
  mobile: number;
  password: string;
}
