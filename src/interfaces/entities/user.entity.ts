export interface IUser {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  mobile: number;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isActivated: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  resetPasswordToken?: string;
  isGoogleAuth: boolean;
}

export interface IRegisterUser {
  name: string;
  email: string;
  mobile: number;
  password: string;
}

export interface IProfile{
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  mobile: number;
  isVerified: boolean;
  isActivated: boolean;
  createdAt: Date;
}