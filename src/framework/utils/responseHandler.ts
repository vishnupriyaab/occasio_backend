//error handler
export const handleError = (message: string, statusCode: number) => {
    return { statusCode, message };
};

//sucess handler
export const handleSuccess = (message: string, statusCode: number, data?: any) => {
    return { statusCode, message, data: data || null };
};