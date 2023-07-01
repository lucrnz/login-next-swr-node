import { CustomFetchOptions, customFetch } from "./customFetch";

export async function fetchBackend<ResultType, RequestBodyType>({
  url,
  config,
  cookies,
  params,
  body,
  method
}: CustomFetchOptions<RequestBodyType>) {
  const backendUrl = process.env["BE_URL"];
  return await customFetch<ResultType, RequestBodyType>({
    url: `${backendUrl}/${url}`,
    body,
    config,
    cookies,
    method,
    params
  });
}
