import useSWR from "swr";
import { getApiFetcher } from "@/utils/api";
import { User } from "@/types/User";

export const useUser = () => {
  const userFetcher = getApiFetcher<User, never>({
    method: "GET"
  });

  const { data: user, mutate, error } = useSWR("me", userFetcher);

  return {
    loading: !user && !error,
    loggedOut: !user,
    user,
    mutate
  };
};
