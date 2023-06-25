import { MainLayout } from "@/components/MainLayout";
import { useUser } from "@/hooks/useUser";
import { logoutAction } from "@/utils/logoutAction";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LogoutPage() {
  const { loggedOut, mutate } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loggedOut) {
      console.log("Logout and redirect");
      logoutAction().finally(() => {
        mutate(undefined); // set data to undefined.
        router.replace("/");
      });
    }
  }, [loggedOut]);

  return (
    <MainLayout>
      <p>You are being signed out, please wait for the redirection.</p>
    </MainLayout>
  );
}
