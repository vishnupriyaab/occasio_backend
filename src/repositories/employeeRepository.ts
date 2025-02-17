import mongoose from "mongoose";
import { IEmployee, IRegisterEmployee } from "../entities/employee.entity";
import Employees from "../framework/models/employeeModel";
import IEmployeeRepository from "../interfaces/repository/employee.Repository";

export class EmployeeRepository implements IEmployeeRepository {
  
  async createEmployee(
    employee: IRegisterEmployee
  ): Promise<IEmployee | never> {
    try {
      const newEmployee = new Employees(employee);
      console.log("new Employee is createddd!!");
      return newEmployee.save();
    } catch (error) {
      console.log("Error creating Employee...", error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IEmployee | null> {
    try {
      return await Employees.findOne({ email: email });
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  async findEmployeeById(employeeId: string): Promise<IEmployee | null> {
    try {
      console.log(1234523456);
      return await Employees.findById(employeeId);
    } catch (error) {
      throw error;
    }
  }

  async updateActivatedStatus(email:string, isActivated:boolean):Promise <IEmployee | null>{
    try {
      const updatedActivatedStatus = await Employees.findOneAndUpdate(
        { email: email },
        { $set: { isActivated: isActivated } },
        { new: true }
      ).exec();

      return updatedActivatedStatus ? updatedActivatedStatus.toObject() : null;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  }


  async savePasswordResetToken(
    employeeId: string,
    token: string
  ): Promise<void> {
    try {
      await Employees.updateOne(
        { _id: employeeId },
        { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 },
        { upsert: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getPasswordResetToken(employeeId: string): Promise<string | null> {
    try {
      const employee = await Employees.findById(employeeId)
      .select("resetPasswordToken");
    return employee?.resetPasswordToken || null;
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(
    employeeId: string,
    hashedPassword: string
  ): Promise<void> {
    try {
      const result = await Employees.findByIdAndUpdate(
        employeeId,
        {
          $set: {
            password: hashedPassword,
          },
        },
        { new: true }
      ).exec();
  
      if (!result) {
        throw new Error("Failed to update password");
      }
    } catch (error) {
      throw error;
    }
  }

  async clearPasswordResetToken(employeeId: string): Promise<void> {
    try {
      await Employees.findByIdAndUpdate(employeeId, {
        $unset: {
          resetPasswordToken: 1,
        },
      }).exec();
    } catch (error) {
      throw error;
    }
  }



}
