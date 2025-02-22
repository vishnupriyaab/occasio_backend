import { IRegisterUser, IUser } from "../../../entities/user.entity";

export default interface IUserAuthRepository{
    findUserByEmail(email: string): Promise<IUser | null> 
    createUser(user: IRegisterUser): Promise<IUser | never>
    findUserById(userId: string): Promise<IUser | null>
    updateActivatedStatus(email: string, isActivated: boolean): Promise<IUser | null>
    savePasswordResetToken(userId: string, token: string): Promise<void>
    getPasswordResetToken(userId: string): Promise<string | null>
    updatePassword( userId: string, hashedPassword: string ): Promise<void>
    clearPasswordResetToken(userId: string): Promise<void>
    createGoogleUser(userData: IUser): Promise<IUser>
}