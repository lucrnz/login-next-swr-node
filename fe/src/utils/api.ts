import {
  ApiResponse,
  ApiResponseOrMessage,
  ApiStatusMessage
} from "@/types/Api";
import { CustomFetchOptions, customFetch } from "./customFetch";

export async function fetchApi<T>({
  url,
  config,
  cookies,
  params,
  body,
  method
}: CustomFetchOptions<T>) {
  return await customFetch({
    url: `/api/${url}`,
    body,
    config,
    cookies,
    method,
    params
  });
}

type GetApiFetcherOptions<T> = Omit<CustomFetchOptions<T>, "url">;

export function getApiFetcher<T>(
  options: GetApiFetcherOptions<ApiResponseOrMessage<T>> | null = null
) {
  async function apiFetcher(url: string) {
    const { data } = await fetchApi<ApiResponseOrMessage<T>>({
      url,
      ...options
    });

    console.log("getApiFetcher data", data);

    if (!data.success) {
      throw new Error((data as ApiResponse<ApiStatusMessage>).data.message);
    }

    return (data as ApiResponse<T>).data;
  }

  return apiFetcher;
}
