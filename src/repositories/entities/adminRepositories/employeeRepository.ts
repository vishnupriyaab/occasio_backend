import mongoose, { FilterQuery } from "mongoose";
import { IEmployee } from "../../../entities/employee.entity";
import IEmployeeRepository from "../../../interfaces/repository/admin/employee.repository";
import Employees from "../../../models/employeeModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export default class AdminEmployeeRepository
  extends CommonBaseRepository<{ employee: Document & IEmployee }>
  implements IEmployeeRepository
{
  constructor() {
    super({ employee: Employees });
  }

  async findEmployeeById(id: string): Promise<IEmployee | null> {
    return this.findById("employee", id);
  }

  async updateEmployeeBlockStatus(
    id: string,
    updateData: Partial<IEmployee>
  ): Promise<IEmployee | null> {
    return this.updateById("employee", id, updateData);
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
  }> {
    try {
      const query: FilterQuery<IEmployee> = {};
      if (searchTerm?.trim()) {
        query.name = {
          $regex: searchTerm.trim(),
          $options: "i",
        };
      }
      let status = filterStatus;
      try {
        if (
          filterStatus &&
          typeof filterStatus === "string" &&
          filterStatus.startsWith("{")
        ) {
          const parsedFilter = JSON.parse(filterStatus);
          status = parsedFilter.status;
        }
      } catch (e) {
        console.error("Error parsing filterStatus:", e);
        status = "all";
      }

      if (status && status !== "all") {
        query.isBlocked = status === "blocked";
      }

      const skip = Math.max(0, (page - 1) * limit);

      const [employee, totalEmployees] = await Promise.all([
        this.findMany("employee", query, {
          skip,
          limit,
          sort: { createdAt: -1 },
        }),
        this.count("employee", query),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalEmployees / limit));

      return {
        employee,
        totalEmployees,
        totalPages: totalPages,
        currentPage: page,
      };
    } catch (error) {
      throw error;
    }
  }
}
