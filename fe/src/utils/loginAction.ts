import Router from "next/router";
import { commonApiFetch } from "./api";
import { ApiStatusMessage } from "@/types/Api";
import { UserWithPassword } from "@/types/User";
import { awaitCallbackIfNeeded } from "./awaitCallbackIfNeeded";

export const loginAction = async (
  mutate: () => void | Promise<unknown>,
  userData: Partial<UserWithPassword>
) => {
  const result = await commonApiFetch<ApiStatusMessage>("login", {
    method: "POST",
    body: JSON.stringify(userData)
  });

  await awaitCallbackIfNeeded(mutate);
  console.log(result);
  Router.replace("/");
};
