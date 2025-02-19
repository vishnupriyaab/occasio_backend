export interface IsAuthenticatedUseCaseRES {
  message: string;
  status: number;
}

export interface ISuccessResponseType {
  message: string;
  success: boolean;
  result?: any;
}

export interface IErrorResponseType {
  message: string;
  success: boolean;
}
