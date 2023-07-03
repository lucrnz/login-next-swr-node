import { fetchApi } from "./api";
import { ApiStatusMessage } from "@/types/Api";

export default async function logoutAction() {
  const { data } = await fetchApi<ApiStatusMessage, never>({
    url: "logout",
    method: "POST"
  });

  return data;
}
