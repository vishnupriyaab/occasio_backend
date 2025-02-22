export interface IAdmin {
  _id: string;
  adminId: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminRegister {
  email: string;
  password: string;
}

export type AdminLoginResponse = {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
};
