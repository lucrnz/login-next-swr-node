export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type ApiStatusMessage = {
  success: boolean;
  message: string;
};

export type ApiResponseOrError<T> = ApiResponse<T> | ApiStatusMessage;
