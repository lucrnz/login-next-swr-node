import useSWR from "swr";
import { getApiFetcher } from "@/utils/api";
import { User } from "@/types/User";

export const useUser = () => {
  const {
    data: user,
    mutate,
    error: gotError,
  } = useSWR("me", getApiFetcher<User>());

  const error = gotError ? (gotError as string) : "";

  const errorLoggedOut =
    error.length > 0 &&
    (error.toLowerCase().includes("authentication required") ||
      error.toLowerCase().includes("authentication failed"));

  return {
    loading: !user && !error,
    loggedOut: !user && errorLoggedOut,
    user,
    mutate,
  };
};
