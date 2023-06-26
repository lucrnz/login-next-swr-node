import { fetchApi } from "./api";
import { UserWithPassword } from "@/types/User";

export async function loginAction(userData: Partial<UserWithPassword>) {
  return await fetchApi({
    url: "login",
    method: "POST",
    body: userData
  });
}
