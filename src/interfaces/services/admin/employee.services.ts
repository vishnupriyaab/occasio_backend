import { IEmployee } from "../../../entities/employee.entity";

export default interface IAdminEmployeeService{
    blockEmployee(employeeId: string): Promise<IEmployee | null>
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
      }>
}