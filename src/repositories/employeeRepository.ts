import { IEmployee, IRegisterEmployee } from "../entities/employee.entity";
import Employees from "../framework/models/employeeModel";
import { IEmployeeRepository } from "../interfaces/IEmployee";

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
    console.log(1234523456)
    return await Employees.findById(employeeId).exec();
  }

  async updateEmployeeStatus(
    email: string,
    isVerified: boolean
  ): Promise<IEmployee | null> {
    try {
      const updatedUser = await Employees.findOneAndUpdate(
        { email: email },
        { $set: { isVerified: isVerified } },
        { new: true }
      ).exec();

      return updatedUser ? updatedUser.toObject() : null;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  }

  async findEmployeeByEmail(email: string): Promise<IEmployee | null> {
    console.log(email, "employeeRepo");
    return await Employees.findOne({ email });
  }

  async savePasswordResetToken(
    employeeId: string,
    token: string
  ): Promise<void> {
    await Employees.updateOne(
      { _id: employeeId },
      { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 },
      { upsert: true }
    );
  }

  async getPasswordResetToken(employeeId: string): Promise<string | null> {
    const employee = await Employees.findById(employeeId)
      .select("resetPasswordToken")
      .exec();
    return employee?.resetPasswordToken || null;
  }

  async updatePassword(
    employeeId: string,
    hashedPassword: string
  ): Promise<void> {
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
  }

  async clearPasswordResetToken(employeeId: string): Promise<void> {
    await Employees.findByIdAndUpdate(employeeId, {
      $unset: {
        resetPasswordToken: 1,
      },
    }).exec();
  }
}
