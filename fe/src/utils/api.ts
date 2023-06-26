import {
  ApiResponse,
  ApiResponseOrMessage,
  ApiStatusMessage
} from "@/types/Api";

export async function commonApiFetch<T>(
  url: string,
  fetchConfig: RequestInit | null = null
) {
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
}

export function getApiFetcher<T>(fetchConfig: RequestInit | null = null) {
  async function apiFetcher(url: string) {
    const data = await commonApiFetch<ApiResponseOrMessage<T>>(
      url,
      fetchConfig
    );

    if (!data.success) {
      throw new Error((data as ApiResponse<ApiStatusMessage>).data.message);
    }

    return (data as ApiResponse<T>).data;
  }

  return apiFetcher;
}
