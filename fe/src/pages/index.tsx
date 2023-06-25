import { MainLayout } from "@/components/MainLayout";
import { defaultPageLoggedIn } from "@/config";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function IndexPage() {
  const router = useRouter();
  const { loggedOut } = useUser();

  useEffect(() => {
    if (!loggedOut) {
      router.replace(defaultPageLoggedIn);
    }
  }, [loggedOut]);

  return (
    <MainLayout>
      <h1>Login example</h1>
      <p>This is main page that anyone can read.</p>
    </MainLayout>
  );
}
