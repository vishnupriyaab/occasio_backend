import { IEmployee } from "../../../entities/employee.entity";

export default interface IEmployeeRepository{
    findEmployeeById(id: string): Promise<IEmployee | null>
    updateEmployeeBlockStatus( id: string, updateData: Partial<IEmployee> ): Promise<IEmployee | null>
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