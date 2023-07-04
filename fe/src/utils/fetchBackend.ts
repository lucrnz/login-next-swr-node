import customFetch, { CustomFetchOptions } from "./customFetch";

export default async function fetchBackend<ResultType, RequestBodyType>({
  url,
  config,
  cookies,
  params,
  body,
  method
}: CustomFetchOptions<RequestBodyType>) {
  return await customFetch<ResultType, RequestBodyType>({
    url: `${process.env["BE_URL"]}/${url}`,
    body,
    config,
    cookies,
    method,
    params
  });
}
