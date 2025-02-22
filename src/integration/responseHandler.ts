import { Response } from "express";
import {
  IErrorResponseType,
  ISuccessResponseType,
} from "../interfaces/common/IIsAuthenticated";

//success - response
export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  let response: ISuccessResponseType = {
    message,
    success: true,
    data: data,
    statusCode: statusCode
  };
  res.status(statusCode).send(response);
};

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
