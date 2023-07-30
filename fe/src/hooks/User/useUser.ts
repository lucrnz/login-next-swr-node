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

import useSWR from "swr";
import { getApiFetcher } from "@/utils/api";
import { User } from "@/types/Entities";

function useUser() {
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
  const loginExpired = Boolean(error && error.message === "Expired login");

  return {
    loading: isLoading,
    loggedOut: !user || loginExpired,
    loginExpired,
    user,
    mutate,
    error
  };
}

export default useUser;
