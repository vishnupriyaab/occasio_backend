import { IEmployee } from "../../../entities/employee.entity"

export default interface IProfileRepository{
    findEmplById(employeeId: string): Promise<IEmployee | null>
    findEmplByEmail(email: string): Promise<IEmployee | null>
    updateUserProfile(userId: string, updateData: Partial<IEmployee>): Promise<IEmployee | null>
    updateUserProfileImage(userId: string, imageUrl: string): Promise<IEmployee | null>
}