/*
 * Copyright 2023 lucdev<lucdev.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ApiResponse,
  ApiResponseOrMessage,
  ApiStatusMessage
} from "@/types/Api";
import customFetch, { CustomFetchOptions } from "./customFetch";

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

    if (!data.success) {
      throw new Error((data as ApiResponse<ApiStatusMessage>).data.message);
    }

    return (data as ApiResponse<ResultType>).data;
  }

  return apiFetcher;
}
