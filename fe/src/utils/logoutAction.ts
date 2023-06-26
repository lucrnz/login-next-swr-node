import { fetchApi } from "./api";
import { ApiStatusMessage } from "@/types/Api";

export async function logoutAction() {
  return await fetchApi<ApiStatusMessage>({
    url: "logout",
    method: "POST"
  });
}
