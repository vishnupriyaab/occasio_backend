import bcrypt from 'bcrypt'

export async function hashOtp(otp: string): Promise<string> {
  const saltRound = 10;
  const hashOtp = await bcrypt.hash(otp, saltRound);
  return hashOtp
}

export const compareOtp = async (otp: string, hashedOtp: string): Promise<boolean> => {
    console.log("1111")
    return bcrypt.compare(otp, hashedOtp);
}