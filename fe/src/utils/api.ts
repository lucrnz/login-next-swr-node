import { ApiResponse, ApiResponseOrError, ApiStatusMessage } from "@/types/Api";

export const commonApiFetch = async <T>(
  url: string,
  fetchConfig: RequestInit | null = null
) => {
  const defaultConfig = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  } as RequestInit;

  const response = await fetch(
    `/api/${url}`,
    fetchConfig
      ? {
          ...fetchConfig,
          ...defaultConfig
        }
      : defaultConfig
  );

  const result: T = await response.json();

  console.log("commonApiFetch: result", result);
  return result;
};

export const getApiFetcher =
  <T>(fetchConfig: RequestInit | null = null) =>
  async (url: string) => {
    const data = await commonApiFetch<ApiResponseOrError<T>>(url, fetchConfig);

    if (!data.success) {
      throw new Error((data as ApiStatusMessage).message);
    }

    return (data as ApiResponse<T>).data;
  };
