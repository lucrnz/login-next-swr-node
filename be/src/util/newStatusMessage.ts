import { ApiResponse, ApiStatusMessage } from "../types/Api.js";

export function newStatusMessage(success: boolean, message: string) {
  return {
    success,
    data: {
      message
    }
  } as ApiResponse<ApiStatusMessage>;
}
