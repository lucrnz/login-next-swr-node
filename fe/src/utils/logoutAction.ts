import Router from "next/router";
import { commonApiFetch } from "./api";
import { ApiStatusMessage } from "@/types/Api";
import { awaitCallbackIfNeeded } from "./awaitCallbackIfNeeded";

export const logoutAction = async (mutate: () => void | Promise<unknown>) => {
  const result = await commonApiFetch<ApiStatusMessage>("logout", {
    method: "POST"
  });

  await awaitCallbackIfNeeded(mutate);
  console.log(result);
  Router.replace("/");
};
