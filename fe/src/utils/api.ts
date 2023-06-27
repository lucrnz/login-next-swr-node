import {
  ApiResponse,
  ApiResponseOrMessage,
  ApiStatusMessage
} from "@/types/Api";
import { CustomFetchOptions, customFetch } from "./customFetch";

export async function fetchApi<ResultType, RequestBodyType>({
  url,
  config,
  cookies,
  params,
  body,
  method
}: CustomFetchOptions<RequestBodyType>) {
  return await customFetch<ApiResponseOrMessage<ResultType>, RequestBodyType>({
    url: `/api/${url}`,
    body,
    config,
    cookies,
    method,
    params
  });
}

type GetApiFetcherOptions<T> = Omit<CustomFetchOptions<T>, "url">;

export function getApiFetcher<ResultType, RequestBodyType>(
  options: GetApiFetcherOptions<RequestBodyType> | null = null
) {
  async function apiFetcher(url: string) {
    const { data } = await fetchApi<ResultType, RequestBodyType>({
      url,
      ...options
    });

    console.log("getApiFetcher data", data);

    if (!data.success) {
      throw new Error((data as ApiResponse<ApiStatusMessage>).data.message);
    }

    return (data as ApiResponse<ResultType>).data;
  }

  return apiFetcher;
}
