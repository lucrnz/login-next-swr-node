import { CustomFetchOptions, customFetch } from "./customFetch";

export async function fetchBackend<T>({
  url,
  config,
  cookies,
  params,
  body,
  method
}: CustomFetchOptions<T>) {
  const backendUrl = "http://localhost:3002";
  return await customFetch({
    url: `${backendUrl}/${url}`,
    body,
    config,
    cookies,
    method,
    params
  });
}
