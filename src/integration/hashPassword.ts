import bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
    const saltRound = 10
    const hashPassword = await bcrypt.hash(password, saltRound)
    return hashPassword
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};