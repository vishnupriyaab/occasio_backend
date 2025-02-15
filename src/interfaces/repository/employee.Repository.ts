import { IEmployee, IRegisterEmployee } from "../../entities/employee.entity";

export default interface IEmployeeRepository {
  findByEmail(email: string): Promise<IEmployee | null>;
  createEmployee(employee: IRegisterEmployee): Promise<IEmployee | never>;
  updateActivatedStatus(
    email: string,
    isActivated: boolean
  ): Promise<IEmployee | null>;
  savePasswordResetToken(employeeId: string, token: string): Promise<void>;
  findEmployeeById(employeeId: string): Promise<any>;
  getPasswordResetToken(employeeId: string): Promise<string | null>;
  updatePassword(employeeId: string, hashedPassword: string): Promise<void>;
  clearPasswordResetToken(employeeId: string): Promise<void>;
  searchEmployee(
    searchTerm: string,
    filterStatus: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    employee: IEmployee[];
    totalEmployees: number;
    totalPages: number;
    currentPage: number;
  }>;
}
