
export interface IEmployee {
  _id: string;
  name: string;
  email: string;
  mobile: number;
  imageUrl:string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isBlocked: boolean;
  isVerified: boolean;
  isActivated: boolean;
  resetPasswordToken: string;
  isEmployee?: "Approved" | "Pending" | "Rejected";
}

export interface IRegisterEmployee {
  name: string;
  email: string;
  mobile: number;
  password: string;
}
