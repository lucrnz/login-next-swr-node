import useSWR from "swr";
import { getApiFetcher } from "@/utils/api";
import { User } from "@/types/User";

export const useUser = () => {
  const userFetcher = getApiFetcher<User>();

  const { data: user, mutate, error: gotError } = useSWR("me", userFetcher);

  const error = gotError ? (gotError as Error) : null;

  let errorLoggedOut = false;

  if (
    error &&
    error.message &&
    (error.message.toLowerCase().includes("authentication required") ||
      error.message.toLowerCase().includes("authentication failed"))
  ) {
    errorLoggedOut = true;
  }

  return {
    loading: !user && !error,
    loggedOut: !user && errorLoggedOut,
    user,
    mutate
  };
};
