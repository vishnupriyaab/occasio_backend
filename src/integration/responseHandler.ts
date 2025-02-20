import { Response } from "express";
import {
  IErrorResponseType,
  ISuccessResponseType,
} from "../interfaces/common/IIsAuthenticated";

//error handler
export const handleError = (message: string, statusCode: number) => {
  return { statusCode, message };
};

//sucess handler
export const handleSuccess = (
  message: string,
  statusCode: number,
  data?: any
) => {
  return { statusCode, message, data: data || null };
};

//success - response
export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
  //   accessToken?: string,
  //   refreshToken?: string
) => {
  let response: ISuccessResponseType = {
    message,
    success: true,
    data: data,
    statusCode: statusCode
  };
  //   if (accessToken && refreshToken) {
  //     res
  //       .status(statusCode)
  //       .cookie("accessToken", accessToken, { httpOnly: false })
  //       .cookie("refreshToken", refreshToken, { httpOnly: true })
  //       .send(response);
  //   } else {
  //     res.status(statusCode).send(response);
  //   }
  res.status(statusCode).send(response);
};

//Error- response
export const ErrorResponse = (
  res: Response,
  statusCode: number,
  message: string
) => {
  const response: IErrorResponseType = {
    message,
    success: false,
  };
  res.status(statusCode).send(response);
};
