import {
  IEmployee,
  IRegisterEmployee,
} from "../../../entities/employee.entity";
import IEmplAuthRepository from "../../../interfaces/repository/employee/auth.respository";
import Employees from "../../../models/employeeModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class EmplAuthRepository
  extends CommonBaseRepository<{ employee: Document & IEmployee }>
  implements IEmplAuthRepository
{
  constructor() {
    super({ employee: Employees });
  }
  async findEmplByEmail(email: string): Promise<IEmployee | null> {
    return this.findOne("employee", { email });
  }

  async createEmployee(
    employee: IRegisterEmployee
  ): Promise<IEmployee | never> {
    return this.createData("employee", employee);
  }

  async updateActivatedStatus(
    email: string,
    isActivated: boolean
  ): Promise<IEmployee | null> {
    return this.findOneAndUpdate("employee", { email }, { isActivated });
  }
  async savePasswordResetToken(
    employeeId: string,
    token: string
  ): Promise<void> {
    await this.updateOne(
      "employee",
      { _id: employeeId },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000, // 1 hour expiry
      },
      { upsert: true }
    );
    return;
  }

  async findEmplById(employeeId: string): Promise<IEmployee | null> {
    return this.findById("employee", employeeId);
  }

  async getPasswordResetToken(employeeId: string): Promise<string | null> {
    const employee = await this.findById("employee", employeeId)
      .select("resetPasswordToken")
      .exec();
    return employee?.resetPasswordToken || null;
  }

  //   async updatePassword(
  //     employeeId: string,
  //     hashedPassword: string
  //   ): Promise<void> {
  //     try {
  //       const result = await Employees.findByIdAndUpdate(
  //         employeeId,
  //         {
  //           $set: {
  //             password: hashedPassword,
  //           },
  //         },
  //         { new: true }
  //       ).exec();

  //       if (!result) {
  //         throw new Error("Failed to update password");
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   }

  async updatePassword(
    employeeId: string,
    hashedPassword: string
  ): Promise<void> {
    const result = await this.updateById("employee", employeeId, {
      password: hashedPassword,
    });

    if (!result) {
      throw new Error("Failed to update password");
    }
  }

  async clearPasswordResetToken(employeeId: string): Promise<void> {
    try {
      await this.updateById(
        "employee", 
        employeeId, 
        { $unset: { resetPasswordToken: 1 } }
      );
    } catch (error) {
      throw error;
    }
  }

}
