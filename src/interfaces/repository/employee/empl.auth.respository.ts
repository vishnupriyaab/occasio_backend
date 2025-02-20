import { IEmployee, IRegisterEmployee } from "../../../entities/employee.entity";

export default interface IEmplAuthRepository{
    findEmplById(employeeId: string): Promise<IEmployee | null>
    findEmplByEmail(email: string): Promise<IEmployee | null>
    createEmployee(employee: IRegisterEmployee): Promise<IEmployee | never>
    updateActivatedStatus(email: string, isActivated: boolean): Promise<IEmployee | null>
    savePasswordResetToken(employeeId: string, token: string): Promise<void>
    getPasswordResetToken(employeeId: string): Promise<string | null>
    updatePassword( employeeId: string, hashedPassword: string ): Promise<void>
    clearPasswordResetToken(employeeId: string): Promise<void>
}