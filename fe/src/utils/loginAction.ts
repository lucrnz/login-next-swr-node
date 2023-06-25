import { commonApiFetch } from "./api";
import { ApiStatusMessage } from "@/types/Api";
import { UserWithPassword } from "@/types/User";

export async function loginAction(userData: Partial<UserWithPassword>) {
  return await commonApiFetch<ApiStatusMessage>("login", {
    method: "POST",
    body: JSON.stringify(userData)
  });
}
