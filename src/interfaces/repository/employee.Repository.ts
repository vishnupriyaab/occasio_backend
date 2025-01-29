import { IEmployee, IRegisterEmployee } from "../../entities/employee.entity";

export default interface IEmployeeRepository {
    findByEmail(email: string): Promise<IEmployee | null>
    createEmployee(employee: IRegisterEmployee): Promise<IEmployee | never>;
    updateEmployeeStatus(email: string,status:boolean): Promise<IEmployee | null>;
    findEmployeeByEmail(email: string): Promise<IEmployee | null>;
    updateActivatedStatus(email:string, isActivated:boolean):Promise <IEmployee | null>
    savePasswordResetToken(employeeId: string, token: string): Promise<void>;
    findEmployeeById(employeeId:string):Promise<any>;
    getPasswordResetToken(employeeId: string): Promise<string | null>;
    updatePassword(employeeId: string, hashedPassword: string): Promise<void>;
    clearPasswordResetToken(employeeId: string): Promise<void>;
  }