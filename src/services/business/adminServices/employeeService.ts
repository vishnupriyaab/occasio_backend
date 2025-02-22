import { IEmployee } from "../../../interfaces/entities/employee.entity";
import IEmployeeRepository from "../../../interfaces/repository/admin/employee.repository";
import IAdminEmployeeService from "../../../interfaces/services/admin/employee.services";
import AdminEmployeeRepository from "../../../repositories/entities/adminRepositories/employeeRepository";

export class AdminEmployeeService implements IAdminEmployeeService {
  private employeeRepo: IEmployeeRepository;
  constructor(employeeRepo: IEmployeeRepository) {
    this.employeeRepo = employeeRepo;
  }

  //block-Unblock Employee
  async blockEmployee(employeeId: string): Promise<IEmployee | null> {
    try {
      const employee = await this.employeeRepo.findEmployeeById(employeeId);
      if (!employee) {
        const error = new Error("Employee not found");
        error.name = "EmployeeNotFound";
        throw error;
      }

      employee.isBlocked = !employee.isBlocked;
      return await this.employeeRepo.updateEmployeeBlockStatus(employeeId, {
        isBlocked: employee.isBlocked,
      });
    } catch (error:unknown) {
      throw error;
    }
  }

  //SearchEmployee
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
      if (page < 1 || limit < 1) {
        const error = new Error("Invalid Page Or Limit");
        error.name = "InvalidPageOrLimit";
        throw error;
      }

      return await this.employeeRepo.searchEmployee(
        searchTerm,
        filterStatus,
        page,
        limit
      );
    } catch (error: unknown) {
      throw error;
    }
  }
}

const adminEmployeeRepository = new AdminEmployeeRepository();
export const adminEmployeeServices = new AdminEmployeeService(
  adminEmployeeRepository
);
