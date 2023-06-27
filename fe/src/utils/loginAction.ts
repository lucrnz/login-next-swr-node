import { ApiStatusMessage } from "@/types/Api";
import { fetchApi } from "./api";
import { UserWithPassword } from "@/types/User";

export async function loginAction(userData: Partial<UserWithPassword>) {
  const { data } = await fetchApi<ApiStatusMessage, typeof userData>({
    url: "login",
    method: "POST",
    body: userData
  });

  return data;
}
