// import jwt, { Secret } from "jsonwebtoken";

// const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET as Secret || "accessSecretKey";
// const REFRESH_TOKEN_SECRET = process.env.JWT_SECRET as Secret || "refreshSecretKey";

// //GenerateAccessToken
// export const generateAccessToken = (payload: object) => {
//   console.log("111111111")
//   return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
// };

// //GenerateRefreshToken
// export const generateRefreshToken = (payload: object) => {
//   console.log(222222222222222)
//   return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
// };

// //VerifyAccessToken
// export const verifyAccessToken = (token: string) => {
//   try {
//     return jwt.verify(token, ACCESS_TOKEN_SECRET);
//   } catch (error) {
//     throw new Error("Invalid or expired access token");
//   }
// };

// //verifyRefreshToken
// export const verifyRefreshToken = (token: string) => {
//   try {
//     return jwt.verify(token, REFRESH_TOKEN_SECRET);
//   } catch (error) {
//     throw new Error("Invalid or expired refresh token");
//   }
// };
