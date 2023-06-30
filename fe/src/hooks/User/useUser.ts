import useSWR from "swr";
import { getApiFetcher, getMockFetcher } from "@/utils/api";
import { User } from "@/types/User";

export function useUser() {
  const userFetcher = getApiFetcher<User, never>({
    method: "GET"
  });

  const {
    data: user,
    mutate,
    error: gotError,
    isLoading
  } = useSWR("me", userFetcher);

  if (isLoading) {
    return {
      loading: true,
      loggedOut: true,
      loginExpired: false,
      user: undefined,
      mutate,
      error: undefined
    };
  }

  const error = gotError ? (gotError as Error) : undefined;
  const loginExpired = error && error.message === "Expired login";

  return {
    loading: isLoading,
    loggedOut: !user,
    loginExpired,
    user,
    mutate,
    error
  };
}
