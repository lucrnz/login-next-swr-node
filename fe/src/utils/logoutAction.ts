import { commonApiFetch } from "./api";
import { ApiStatusMessage } from "@/types/Api";

export async function logoutAction() {
  return await commonApiFetch<ApiStatusMessage>("logout", {
    method: "POST"
  });
}
