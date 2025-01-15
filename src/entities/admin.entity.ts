export interface IAdmin {
  _id: string;
  adminId: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt:Date;
}

export interface IAdminRegister {
    email: string;
    password: string;
  }
  