import { IAdmin } from "../entities/admin.entity";
import { IUser } from "../entities/user.entity";
import Admin from "../framework/models/adminModel";
import Users from "../framework/models/userModel";
import bcrypt from "bcrypt";
import IAdminRepository from "../interfaces/repository/admin.Repository";
import Employees from "../framework/models/employeeModel";
import { IEmployee } from "../entities/employee.entity";
import mongoose from "mongoose";

export class AdminRepository implements IAdminRepository {

  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    try {
      console.log(email, "userrepooo");
      return await Admin.findOne({ email: email });
    } catch (error) {
      throw error
    }
  }

  async validateCredentials(email: string, password: string): Promise<boolean> {
    try {
      const admin = await this.findAdminByEmail(email);
      if (!admin?.password) return false;
      return await bcrypt.compare(password, admin.password);
    } catch (error) {
      throw error
    }
  }

  async findById(id:string):Promise<IUser | null> {
    try {
      return await Users.findById(id);
    } catch (error) {
      throw error
    }
  }

  async updateStatus(id:string, updateData:any):Promise<IUser | null> {
    try {
      return await Users.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error
    }
  }
  async searchEmployee(
    searchTerm: string,
    filterStatus: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    employee: IEmployee[];
    totalEmployees: number;
    totalPages: number;
    currentPage: number;
  }>{
    try {
      const query: mongoose.FilterQuery<IEmployee> = {};
    if (searchTerm && searchTerm.trim() !== "") {
      query.name = {
        $regex: searchTerm.trim(),
        $options: "i",
      };
    }

    if (filterStatus === "blocked") {
      query.isBlocked = true;
    } else if (filterStatus === "unblocked") {
      query.isBlocked = false;
    }
    const skip = Math.max(0, (page - 1) * limit);
    const [employee, totalEmployees] = await Promise.all([
      Employees.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
        Employees.countDocuments(query),
    ]);
    const totalPages = Math.max(1, Math.ceil(totalEmployees / limit))

    return{
      employee,
      totalEmployees,
      totalPages,
      currentPage: page,
    }
    } catch (error) {
      throw error;
    }
  }
}
